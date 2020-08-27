using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AngularJSMvc.Models.EF
{
    public class Host
    {
        [Key]
        [Column(Order = 0)]
        [ForeignKey("HostUser")]
        public string HostUserId { get; set; }

        [Key]
        [Column(Order = 1)]
        public string TournamentName { get; set; }

        [Required]
        public User HostUser { get; set; }
    }
}