using System;
using System.Collections.Generic;
using System.IO;
using HowWasYourDay.ViewModels;
using Microsoft.AspNet.Mvc;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.ProjectOxford.Emotion.Contract;

namespace HowWasYourDay.Controllers
{
    [Route("api/[controller]")]
    public class EmotionController : Controller
    {
        private readonly IEmotionServiceClient _emotionService;

        public EmotionController(IEmotionServiceClient emotionService)
        {
            _emotionService = emotionService;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new [] { "Team 1", "Clockwork", "Team 3", "Team 4", "Team 5", "Design", "UX", "New Business", "Commercial", "Innovation", "Admin", "Client Services", "Content", "The directors" };
        }
        
        [HttpPost]
        public IEnumerable<EmotionViewModel> Post([FromBody]Upload upload)
        {
            byte[] bytes = Convert.FromBase64String(upload.Image.Replace("data:image/jpeg;base64,", ""));

            using (var inputStream = new MemoryStream(bytes))
            {
                Emotion[] emotions = _emotionService.RecognizeAsync(inputStream).Result;

                foreach (var emotion in emotions)
                {
                    yield return GetTopScore(emotion, new EmotionViewModel
                    {
                        Height = emotion.FaceRectangle.Height,
                        Width = emotion.FaceRectangle.Width,
                        Top = emotion.FaceRectangle.Top,
                        Left = emotion.FaceRectangle.Left
                    });
                }
            }
        }

        private EmotionViewModel GetTopScore(Emotion emotion, EmotionViewModel emotionViewModel)
        {
            emotionViewModel.TopScore = emotion.Scores.Anger;
            emotionViewModel.TopScoreType = "Anger";

            if (emotion.Scores.Contempt > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Contempt;
                emotionViewModel.TopScoreType = "Contempt";
            }

            if (emotion.Scores.Disgust > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Disgust;
                emotionViewModel.TopScoreType = "Disgust";
            }

            if (emotion.Scores.Fear > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Fear;
                emotionViewModel.TopScoreType = "Fear";
            }

            if (emotion.Scores.Happiness > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Happiness;
                emotionViewModel.TopScoreType = "Happiness";
            }

            if (emotion.Scores.Neutral > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Neutral;
                emotionViewModel.TopScoreType = "Neutral";
            }

            if (emotion.Scores.Sadness > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Sadness;
                emotionViewModel.TopScoreType = "Sadness";
            }

            if (emotion.Scores.Surprise > emotionViewModel.TopScore)
            {
                emotionViewModel.TopScore = emotion.Scores.Surprise;
                emotionViewModel.TopScoreType = "Surprise";
            }

            return emotionViewModel;
        }
    }

    public class Upload
    {
        public string Department { get; set; }

        public string Image { get; set; }
    }
}
