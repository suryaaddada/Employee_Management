using Employee_Management.Model;

namespace Employee_Management.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto> GetByIdAsync(int id);
        Task<EmployeeDto> CreateAsync(EmployeeDto dto);
        Task<bool> UpdateAsync(int id, EmployeeDto dto);
        Task<bool> DeleteAsync(int id);
    }
}