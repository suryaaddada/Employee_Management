using Employee_Management.Data;
using Employee_Management.Model;
using Employee_Management.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;
    private readonly TokenService _tokenService;
    private readonly AppDbContext _context;
    private IConfiguration _config;


    public AuthController(AuthService service,TokenService tokenService, AppDbContext context, IConfiguration config)
    {
        _service = service;
        _tokenService = tokenService;
        _context = context;
        _config = config;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _service.RegisterAsync(dto);
        return Ok(result);
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _service.ValidateUserAsync(dto);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
        var accessTokenExpiryMinutes = double.Parse(_config["JwtSettings:AccessTokenExpirationMinutes"]);
        Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddMinutes(accessTokenExpiryMinutes)
        });

        Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshToken.Expires
        });

        return Ok(new { message = "Logged in" });

    }


    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshTokenValue))
            return Unauthorized(new { message = "Refresh token missing" });

        var tokenInDb = await _context.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Token == refreshTokenValue && !t.IsRevoked);

        if (tokenInDb == null || tokenInDb.Expires < DateTime.UtcNow)
            return Unauthorized(new { message = "Invalid or expired refresh token" });

        tokenInDb.IsRevoked = true;

        var newAccessToken = _tokenService.GenerateAccessToken(tokenInDb.User);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        tokenInDb.User.RefreshTokens.Add(newRefreshToken);

        await _context.SaveChangesAsync();
        var accessTokenExpiryMinutes = double.Parse(_config["JwtSettings:AccessTokenExpirationMinutes"]);

        Response.Cookies.Append("accessToken", newAccessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddMinutes(accessTokenExpiryMinutes)
        });

        Response.Cookies.Append("refreshToken", newRefreshToken.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = newRefreshToken.Expires
        });

        return Ok(new { message = "Token refreshed" });
    }


    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("refreshToken", out var refreshTokenValue))
        {
            var tokenInDb = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshTokenValue);

            if (tokenInDb != null)
            {
                tokenInDb.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");

        return Ok(new { message = "Logged out successfully" });
    }


    [HttpGet()]
    public async Task<IActionResult> AllUsers()
    {
        var result = await _service.FecthAllAsync();
        if (result == null)
        {
            return NotFound("No users found.");
        }
        return Ok(result);
    }
}