using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AngularJSMvc.Models.EF
{
    public class Enrollment
    {
        [Key]
        [Column(Order = 0)]
        public string EnrolledUserId { get; set; }

        [Key]
        [Column(Order = 1)]
        public string EnrolledTournamentName { get; set; }

        [Required]
        public int placement { get; set; }

        [Required]
        public int value { get; set; }
    }
}