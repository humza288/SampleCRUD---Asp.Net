using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;

namespace AngularJSMvc.Models.EF
{
    public class User
    {
        public User()
        {
            this.HostedTournaments = new HashSet<Host>();
        }

        [Key]
        [MaxLength(32)]
        public string Email { get; set; }

        [Required]
        [MaxLength(20)]
        public string Password { get; set; }

        public virtual ICollection<Host> HostedTournaments { get; set; }
    }
}