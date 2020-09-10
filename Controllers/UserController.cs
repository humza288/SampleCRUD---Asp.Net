using AngularJSMvc.Models.EF;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web.Mvc;

namespace AngularJSMvc.Controllers
{
    public class UserController : Controller
    {
        private AngularsJSMvcDbContext db = null;

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

        public ActionResult Details(string username)
        {
            Debug.WriteLine(username);
            var user = db.Users.Find(username);

            if (user != null)
            {
                return Json(new { Email = user.Email, Password = user.Password }, JsonRequestBehavior.AllowGet);
            }

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Login(string username, string password)
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

        [HttpPost]
        public ActionResult Create(User user)
        {
            Debug.WriteLine(user.Email);
            Debug.WriteLine(user.Password);
            db.Users.Add(user);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public ActionResult EditUser(User user)
        {
            var tempUser = db.Users.Find(user.Email);
            tempUser.Password = user.Password;

            db.Entry(tempUser).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public ActionResult Delete(string username)
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