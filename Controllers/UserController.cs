using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AngularJSMvc.Models.EF;
using System.Diagnostics;
using System.ComponentModel.DataAnnotations;

namespace AngularJSMvc.Controllers
{
    public class UserController : Controller
    {
        private AngularsJSMvcDbContext db = null;
        // GET: User

        public UserController()
        {
            db = new AngularsJSMvcDbContext();
        }
        public ActionResult IndexUsers()
        {
            List<User> users = db.Users.ToList();
            List<KeyValuePair<string, string>> userNames = new List<KeyValuePair<string, string>>();

            foreach (var user in users)
            {
                userNames.Add(new KeyValuePair<string, string>(user.Email, user.Password));   
            }

            return Json(userNames, JsonRequestBehavior.AllowGet);
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

        public JsonResult IndexAvailableTournaments(string username)
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

        public JsonResult Details(string username)
        {
            Debug.WriteLine(username);
            var user = db.Users.Find(username);

            if (user != null) {
                return Json(new { Email = user.Email, Password = user.Password }, JsonRequestBehavior.AllowGet);
            }

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Login(string username, string password)
        {
            Debug.WriteLine(username);
            var user = db.Users.Find(username);
            if (user != null) 
            {
                if (user.Password == password)
                {
                    Debug.WriteLine("Login Sucess");
                    return Json(new { Email = user.Email, Password = user.Password }, JsonRequestBehavior.AllowGet);
                }
            }
           
            Debug.WriteLine("Login Failure");
            return Json(null);
        }

        public JsonResult EnrollTournament(string username, string tournamentName, int value)
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

        public JsonResult LeaveTournament(string username, string tournamentName)
        {
            var query = db.Enrollments.Find(username, tournamentName);

            db.Enrollments.Remove(query);
            db.SaveChanges();

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTournament(string TournamentName, string Email)
        {
            var query = db.Tournaments.Find(TournamentName);
            return Json(query, JsonRequestBehavior.AllowGet);
        }

        public JsonResult UpdateEnrollee(string username, string tournamentName, int value)
        {
            var query = db.Enrollments.Find(username, tournamentName);
            query.value = value;

            db.Entry(query).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();

            return Json(query, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetEnrolledTournaments(string username)
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

        public JsonResult GetTournamentEnrollees(string TournamentName)
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

        public JsonResult GetHostedTournaments(string username)
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
        public JsonResult Create(User user)
        {
            Debug.WriteLine(user.Email);
            Debug.WriteLine(user.Password);
            db.Users.Add(user);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult EditUser(User user)
        {
            var tempUser = db.Users.Find(user.Email);
            tempUser.Password = user.Password;

            db.Entry(tempUser).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult EditTournament(Tournament tournament)
        {
            db.Entry(tournament).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }


        [HttpPost]
        public JsonResult AddTournament(User user, Tournament tournament)
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
        public JsonResult DeleteTournament(User user, Tournament tournament)
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

        [HttpPost]
        public JsonResult Delete(string username)
        {
            var user = db.Users.Find(username);

            var query = db.Enrollments
                            .Where(e => e.EnrolledUserId == username)
                            .ToList<Enrollment>();
            var hosting = db.Hosts
                            .Where(h => h.HostUserId == username)
                            .ToList<Host>();

            if (hosting != null)
            {
                foreach (var hosted in hosting)
                {
                    var enrollmentQuery = db.Enrollments
                            .Where(e => e.EnrolledTournamentName == hosted.TournamentName)
                            .ToList<Enrollment>();
                    
                    if (enrollmentQuery != null)
                    {
                        foreach (var enrollment in enrollmentQuery)
                        {
                            db.Enrollments.Remove(enrollment);
                        }
                    }
                }
            }

            if (query != null)
            {
                foreach (var enrollment in query)
                {
                    db.Enrollments.Remove(enrollment);
                }
            }


            db.Users.Remove(user);
            db.SaveChanges();
            return Json(null);
        }
    }
}