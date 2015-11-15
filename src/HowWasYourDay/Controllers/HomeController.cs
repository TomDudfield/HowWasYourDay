using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Emotion.Contract;

namespace HowWasYourDay.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Index(string image)
        {
            EmotionServiceClient emotionServiceClient = new EmotionServiceClient("e5d15d97c41c4aa7bf042af46bb02e3f");

            byte[] fileBytes = Convert.FromBase64String(image.Replace("data:image/jpeg;base64,", ""));

            using (MemoryStream ms = new MemoryStream(fileBytes))
            {
                var s = emotionServiceClient.RecognizeAsync(ms);
                Emotion[] r = s.Result;
                
                //MediaTypeNames.Image streamImage = MediaTypeNames.Image.FromStream(ms);
                //context.Response.ContentType = "image/jpeg";
                //streamImage.Save(context.Response.OutputStream, ImageFormat.Jpeg);
                //return streamImage;
            }
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View("~/Views/Shared/Error.cshtml");
        }
    }
}
