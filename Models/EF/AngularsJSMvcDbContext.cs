using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace AngularJSMvc.Models.EF
{
    public class AngularsJSMvcDbContext : DbContext
    {
        public AngularsJSMvcDbContext() : base("name = AngularJsMvcDbContext")
        { 

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Host> Hosts { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }

    }
}