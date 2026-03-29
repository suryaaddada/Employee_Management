using Employee_Management.Data;
using Employee_Management.Entities;
using Employee_Management.Model;
using Employee_Management.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Employee_Management.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext _context;

        public DepartmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepartmentDto>> GetAllAsync()
        {
            return await _context.Departments
                .AsNoTracking()
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name
                })
                .ToListAsync();
        }

        public async Task<DepartmentDto> GetByIdAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);

            if (dept == null) return null;

            return new DepartmentDto
            {
                Id = dept.Id,
                Name = dept.Name
            };
        }

        public async Task<DepartmentDto> CreateAsync(DepartmentDto dto)
        {
            var exists = await _context.Departments
                .AnyAsync(d => d.Name == dto.Name);

            if (exists)
                throw new Exception("Department already exists");

            var dept = new Department
            {
                Name = dto.Name
            };

            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();

            dto.Id = dept.Id;
            return dto;
        }

        public async Task<bool> UpdateAsync(int id, DepartmentDto dto)
        {
            var dept = await _context.Departments.FindAsync(id);

            if (dept == null) return false;

            dept.Name = dto.Name;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);

            if (dept == null) return false;

            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}