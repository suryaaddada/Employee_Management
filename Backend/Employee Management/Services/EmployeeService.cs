using Employee_Management.Data;
using Employee_Management.Entities;
using Employee_Management.Model;
using Employee_Management.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Employee_Management.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmployeeDto>> GetAllAsync()
        {
            return await _context.Employees
                .AsNoTracking()
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Email = e.Email,
                    Salary = e.Salary,
                    Phone = e.Phone,
                    DepartmentId = e.DepartmentId,
                    DateOfJoining = e.DateOfJoining
                })
                .ToListAsync();
        }

        public async Task<EmployeeDto> GetByIdAsync(int id)
        {
            var emp = await _context.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);

            if (emp == null) return null;

            return new EmployeeDto
            {
                Id = emp.Id,
                Name = emp.Name,
                Email = emp.Email,
                Phone = emp.Phone,
                Salary = emp.Salary,
                DepartmentId = emp.DepartmentId,
                DateOfJoining= emp.DateOfJoining
            };
        }

        public async Task<EmployeeDto> CreateAsync(EmployeeDto dto)
        {


            var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);

            if (!departmentExists)
                throw new Exception("Invalid DepartmentId");

            var emailExists = await _context.Employees.AnyAsync(e => e.Email == dto.Email);

            if (emailExists)
                throw new Exception("Email already exists");

            var emp = new Employee
            {
                Name = dto.Name,
                Email = dto.Email,
                Salary = dto.Salary,
                Phone = dto.Phone,
                DepartmentId = dto.DepartmentId
            };

            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();

            dto.Id = emp.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, EmployeeDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;

            emp.Name = dto.Name;
            emp.Email = dto.Email;
            emp.Salary = dto.Salary;
            emp.Phone = dto.Phone;
            emp.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return false;

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMultipleAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                return false;

            var employees = await _context.Employees
                .Where(e => ids.Contains(e.Id))
                .ToListAsync();

            if (!employees.Any())
                return false;

            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}