using System;
using System.Collections.Generic;
using System.IO;
using ImageProcessor;
using ImageProcessor.Imaging;
using ImageProcessor.Processors;
using Microsoft.AspNet.Mvc;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Emotion.Contract;

namespace HowWasYourDay.Controllers
{
    [Route("api/[controller]")]
    public class EmotionController : Controller
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new [] { "Team 1", "Clockwork", "Team 3", "Team 4", "Team 5", "Design", "UX", "New Business", "Commercial", "Innovation", "Admin", "Client Services", "Content", "The directors" };
        }
        
        [HttpPost]
        public Emotion[] Post([FromBody]Upload upload)
        {
            var emotionServiceClient = new EmotionServiceClient("e5d15d97c41c4aa7bf042af46bb02e3f");
            byte[] bytes = Convert.FromBase64String(upload.Image.Replace("data:image/jpeg;base64,", ""));

            using (var inputStream = new MemoryStream(bytes))
            {
                Emotion[] emotions = emotionServiceClient.RecognizeAsync(inputStream).Result;

                foreach (var emotion in emotions)
                {
                    emotion.Scores.GetTopScore();
                }

                return emotions;
            }
        }
    }

    public class Upload
    {
        public string Department { get; set; }

        public string Image { get; set; }
    }
}
