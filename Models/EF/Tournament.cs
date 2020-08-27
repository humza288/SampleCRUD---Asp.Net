using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AngularJSMvc.Models.EF
{
    public class Tournament
    {
        public Tournament()
        {
            //this.EnrolledUsers = new HashSet<User>();
        }

        [Key]
        [ForeignKey("Host"), Column(Order = 1)]
        public string TournamentName { get; set; }

        [Required]
        [MaxLength(32)]
        public string RankField { get; set; }

        [ForeignKey("Host"), Column(Order = 0)]
        public string HostEmail { get; set; }

        [Required]
        public Host Host { get; set; }

    }
}