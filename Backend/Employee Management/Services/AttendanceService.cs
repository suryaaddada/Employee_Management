using Employee_Management.Data;
using Employee_Management.Entities;
using Employee_Management.Model;
using Employee_Management.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

public class AttendanceService : IAttendanceService
{
    private readonly AppDbContext _context;

    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> MarkAttendanceAsync(AttendanceDto dto)
    {
        var empExists = await _context.Employees
            .AnyAsync(e => e.Id == dto.EmployeeId);

        if (!empExists)
            throw new Exception("Invalid Employee");

        var today = dto.Date.Date;

        var existing = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date == today);

        if (existing != null)
        {
            existing.CheckOut = dto.CheckOut;
            await _context.SaveChangesAsync();

            return "Check-out updated";
        }

        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Date = today,
            CheckIn = dto.CheckIn,
            CheckOut = dto.CheckOut,
            IsPresent = dto.IsPresent
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        return "Attendance marked";
    }

    public async Task<List<AttendanceDto>> GetByEmployeeAsync(int employeeId)
    {
        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId)
            .Select(a => new AttendanceDto
            {
                EmployeeId = a.EmployeeId,
                Date = a.Date,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                IsPresent = a.IsPresent
            })
            .ToListAsync();
    }

    public async Task<List<AttendanceDto>> GetAttendanceAsync()
    {
        
        var attendance = await _context.Attendances
            .Select(a => new AttendanceDto
            {
                EmployeeId = a.EmployeeId,
                Date = a.Date,
                CheckIn = a.CheckIn,
                CheckOut = a.CheckOut,
                IsPresent = a.IsPresent
            })
            .ToListAsync();
        return attendance;
    }
}