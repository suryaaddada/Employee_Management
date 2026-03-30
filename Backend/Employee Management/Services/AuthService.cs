using Employee_Management.Data;
using Employee_Management.Model;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

public class AuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> RegisterAsync(RegisterDto dto)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (userExists)
            throw new Exception("User already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User registered successfully";
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            throw new Exception("Invalid credentials");

        var isValid = VerifyPassword(dto.Password, user.PasswordHash);

        if (!isValid)
            throw new Exception("Invalid credentials");

        return "Login successful";
    }

    private string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    } 

    public async Task<List<User>> FecthAllAsync()
    {
        return await _context.Users.ToListAsync();
    }
}