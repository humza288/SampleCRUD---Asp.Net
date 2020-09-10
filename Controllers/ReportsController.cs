using AngularJSMvc.Models.EF;
using CrystalDecisions.CrystalReports.Engine;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web.Mvc;

namespace AngularJSMvc.Controllers
{
    public class ReportsController : Controller
    {
        private AngularsJSMvcDbContext db = null;

        public ReportsController()
        {
            db = new AngularsJSMvcDbContext();
        }

        // GET: Generated tournament report for all tournaments
        [HttpGet]
        public ActionResult GenerateTournamentsReport()
        {
            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports"), "TournamentsReport.rpt"));
            rd.SetDataSource(db.Tournaments.ToList());

            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();

            rd.PrintOptions.PaperOrientation = CrystalDecisions.Shared.PaperOrientation.DefaultPaperOrientation;

            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream, "application/pdf", "tournaments_list.pdf");
        }


        // GET: Get a report for an induvidual tournament.
        [HttpGet]
        public ActionResult GenerateInduvidualTournamentReport(string TournamentName)
        {
            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports"), "InduvidualTournamentReport.rpt"));

            var enrollments = db.Enrollments
                            .Where(e => e.EnrolledTournamentName == TournamentName)
                            .ToList();

            var tournament = db.Tournaments
                            .Where(e => e.TournamentName == TournamentName)
                            .ToList();

            rd.Database.Tables[0].SetDataSource(enrollments);
            rd.Database.Tables[1].SetDataSource(tournament);

            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();

            rd.PrintOptions.PaperOrientation = CrystalDecisions.Shared.PaperOrientation.DefaultPaperOrientation;

            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream, "application/pdf", "tournament_report.pdf");
        }

        // GET: A report for an induvidual user.
        [HttpGet]
        public ActionResult GenerateUserReport(string UserName = "sameer777@att.net")
        {
            ReportDocument rd = new ReportDocument();
            rd.Load(Path.Combine(Server.MapPath("~/Reports"), "UserReport.rpt"));

            var enrollments = db.Enrollments
                            .Where(e => e.EnrolledUserId == UserName)
                            .ToList();

            foreach (var i in enrollments)
            {
                Debug.WriteLine(i.EnrolledTournamentName);
            }

            var hosting = db.Tournaments
                            .Where(e => e.HostEmail == UserName)
                            .ToList();

            foreach (var i in hosting)
            {
                Debug.WriteLine(i.TournamentName);
            }

            var user = db.Users
                            .Where(e => e.Email == UserName)
                            .ToList();

            foreach (var i in user)
            {
                Debug.WriteLine(i.Email);
            }

            rd.Database.Tables[0].SetDataSource(user);

            rd.Subreports["HostedTournaments"].Database.Tables[0].SetDataSource(hosting);
            rd.Subreports["EnrolledTournaments"].Database.Tables[0].SetDataSource(enrollments);

            Response.Buffer = false;
            Response.ClearContent();
            Response.ClearHeaders();

            Stream stream = rd.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            stream.Seek(0, SeekOrigin.Begin);

            return File(stream, "application/pdf", "user_report.pdf");
        }
    }
}