using AngularJSMvc.Models.EF;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;

namespace AngularJSMvc.Controllers
{
    public class TournamentController : Controller
    {
        private AngularsJSMvcDbContext db = null;

        public TournamentController()
        {
            db = new AngularsJSMvcDbContext();
        }

        public ActionResult IndexHosts()
        {
            List<Host> hosts = db.Hosts.ToList();
            return Json(hosts, JsonRequestBehavior.AllowGet);
        }

        public ActionResult IndexTournaments()
        {
            List<Tournament> tournaments = db.Tournaments.ToList();
            return Json(tournaments, JsonRequestBehavior.AllowGet);
        }

        public ActionResult IndexAvailableTournaments(string username)
        {
            List<Tournament> tournamentsTemp = db.Tournaments.ToList();
            List<Tournament> tournaments = new List<Tournament>();

            foreach (var tournament in tournamentsTemp)
            {
                if (db.Enrollments.Find(username, tournament.TournamentName) == null)
                {
                    tournaments.Add(tournament);
                }
            }

            return Json(tournaments, JsonRequestBehavior.AllowGet);
        }

        public ActionResult EnrollTournament(string username, string tournamentName, int value)
        {
            var enrollment = new Enrollment();

            enrollment.EnrolledUserId = username;
            enrollment.EnrolledTournamentName = tournamentName;
            enrollment.value = value;
            enrollment.placement = 0;

            db.Enrollments.Add(enrollment);
            db.SaveChanges();

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult LeaveTournament(string username, string tournamentName)
        {
            var query = db.Enrollments.Find(username, tournamentName);

            db.Enrollments.Remove(query);
            db.SaveChanges();

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTournament(string TournamentName, string Email)
        {
            var query = db.Tournaments.Find(TournamentName);
            return Json(query, JsonRequestBehavior.AllowGet);
        }

        public ActionResult UpdateEnrollee(string username, string tournamentName, int value)
        {
            var query = db.Enrollments.Find(username, tournamentName);
            query.value = value;

            db.Entry(query).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();

            return Json(query, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetEnrolledTournaments(string username)
        {
            var query = db.Enrollments
                            .Where(e => e.EnrolledUserId == username)
                            .ToList<Enrollment>();

            var tournaments = new List<Tournament>();

            foreach (var enrollment in query)
            {
                var tournament = db.Tournaments.Find(enrollment.EnrolledTournamentName);
                tournaments.Add(tournament);
            }

            if (tournaments != null)
            {
                Debug.WriteLine("Lookup Sucess");
                return Json(tournaments, JsonRequestBehavior.AllowGet);
            }

            Debug.WriteLine("Lookup Failure");
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTournamentEnrollees(string TournamentName)
        {
            var query = db.Enrollments
                            .Where(e => e.EnrolledTournamentName == TournamentName)
                            .ToList<Enrollment>();

            if (query != null)
            {
                Debug.WriteLine("Lookup Sucess");
                return Json(query, JsonRequestBehavior.AllowGet);
            }

            Debug.WriteLine("Lookup Failure");
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetHostedTournaments(string username)
        {
            var query = db.Tournaments
                        .Where(t => t.HostEmail == username)
                        .ToList<Tournament>();

            if (query != null)
            {
                Debug.WriteLine("Lookup Sucess");
                return Json(query, JsonRequestBehavior.AllowGet);
            }

            Debug.WriteLine("Lookup Failure");
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult EditTournament(Tournament tournament)
        {
            db.Entry(tournament).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public ActionResult AddTournament(User user, Tournament tournament)
        {
            Debug.WriteLine(user.Email);
            Debug.WriteLine(user.Password);
            Debug.WriteLine(tournament.TournamentName);
            Debug.WriteLine(tournament.RankField);

            var userLocal = db.Users.Find(user.Email);

            var Host = new Host();
            Host.HostUser = userLocal;
            tournament.Host = Host;
            Host.TournamentName = tournament.TournamentName;

            userLocal.HostedTournaments.Add(Host);
            db.Hosts.Add(Host);
            db.Tournaments.Add(tournament);

            db.SaveChanges();

            return Json(null);
        }

        [HttpPost]
        public ActionResult DeleteTournament(User user, Tournament tournament)
        {
            var host = db.Hosts.Find(user.Email, tournament.TournamentName);
            var query = db.Enrollments
                            .Where(e => e.EnrolledTournamentName == tournament.TournamentName)
                            .ToList<Enrollment>();

            if (query != null)
            {
                foreach (var enrollment in query)
                {
                    db.Enrollments.Remove(enrollment);
                }
            }

            db.Hosts.Remove(host);
            db.SaveChanges();
            Debug.WriteLine("Succesfully deleted the tournament");
            return Json(null);
        }
    }
}