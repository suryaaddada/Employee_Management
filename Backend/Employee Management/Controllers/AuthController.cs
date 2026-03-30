using Employee_Management.Model;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
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
        var result = await _service.LoginAsync(dto);
        return Ok(result);
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