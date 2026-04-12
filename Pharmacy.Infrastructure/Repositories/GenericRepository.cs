using Microsoft.EntityFrameworkCore;
using Pharmacy.Core.Interfaces;
using Pharmacy.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Pharmacy.Infrastructure.Repositories;


public class GenericRepositry<T> : IGenericRepositry<T> where T : class
{
    private readonly AppDbContext _context;

    public GenericRepositry(AppDbContext context)
    {
        _context = context;
    }


    public async Task<IReadOnlyList<T>> GetAllAsync()
    => await _context.Set<T>().AsNoTracking().ToListAsync();

    public async Task<IReadOnlyList<T>> GetAllAsync(params Expression<Func<T, object>>[] inculdes)
    {
        var query = _context.Set<T>().AsQueryable();
        foreach (var item in inculdes)
        {
            query = query.Include(item);
        }
        return await query.ToListAsync();
    }

    public async Task<T> GetByIdAsync(int id)
    {
        var entity = await _context.Set<T>().FindAsync(id);
        return entity;

    }

    public async Task<T> GetByIdAsync(int id, params Expression<Func<T, object>>[] inculdes)
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var item in inculdes)
        {
            query = query.Include(item);
        }
        var entity = await query.FirstOrDefaultAsync(x => EF.Property<int>(x, "Id") == id);
        return entity;
    }

    public async Task AddAsync(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(T entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }



    public async Task DeleteAsync(int id)
    {
        var entity = await _context.Set<T>().FindAsync(id);
        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<int> CountAsync()
    => await _context.Set<T>().CountAsync();
}
