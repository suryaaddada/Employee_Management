using Employee_Management.Model;

namespace Employee_Management.Services.Interfaces
{
    public interface IAttendanceService
    {
        Task<string> MarkAttendanceAsync(AttendanceDto dto);
        Task<List<AttendanceDto>> GetByEmployeeAsync(int employeeId);

        Task<List<AttendanceDto>> GetAttendanceAsync();
    }
}
