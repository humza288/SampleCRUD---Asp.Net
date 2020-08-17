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
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> users { get; set; }
    }
}