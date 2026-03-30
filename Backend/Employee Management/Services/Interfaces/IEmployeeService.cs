using Employee_Management.Model;
using Microsoft.AspNetCore.Mvc;

namespace Employee_Management.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<List<EmployeeDto>> GetAllAsync();
        Task<EmployeeDto> GetByIdAsync(int id);
        Task<EmployeeDto> CreateAsync(EmployeeDto dto);
        Task<bool> UpdateAsync(int id, EmployeeDto dto);
        Task<bool> DeleteAsync(int id);

        Task<bool> DeleteMultipleAsync(List<int> ids);
    }
}