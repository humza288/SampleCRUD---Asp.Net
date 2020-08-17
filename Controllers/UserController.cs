using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AngularJSMvc.Models.EF;

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
        public ActionResult Index()
        {
            List<User> users = db.users.ToList();
            return Json(users, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Details(int id)
        {
            var user = db.users.Find(id);
            return Json(user, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(User user)
        {
            db.users.Add(user);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Edit(User user)
        {
            db.Entry(user).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var user = db.users.Find(id);
            db.users.Remove(user);
            db.SaveChanges();
            return Json(null);
        }
    }
}