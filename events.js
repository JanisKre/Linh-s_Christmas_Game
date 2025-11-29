(function () {
  const EVENTS = {
    university: {
      id: "university",
      roomId: "gift",
      title: "University of Mannheim – The Tower of Infinite Deadlines",
      npcName: "Prof. Dr. Schneeflocke",
      intro: "Ah, a brave student appears! To proceed, you must answer… an academically festive question.",
      question: "What is the academically correct way to prepare for Christmas?",
      options: [
        {
          text: "Start early, plan presents, meet loved ones, and enjoy peaceful days together doing STOßLÜFTEN.",
          correct: true,
          successMsg: "Outstanding! Evidence-based Christmas preparation. You've earned the festive final PASS! ✅",
          failMsg: ""
        },
        {
          text: "Write a 300-page literature review on cookie-to-cinnamon ratio and forget Christmas happened.",
          correct: false,
          successMsg: "",
          failMsg: "An interesting interpretation. That's a solid 4.0 in 'Applied Christmas Regret'. ❌"
        },
        {
          text: "Procrastinate until Dec 24th 23:59, panic-buy socks, and claim it's 'minimalist gifting theory'.",
          correct: false,
          successMsg: "",
          failMsg: "Hm. Even failed exams can be repeated. Try again! ❌"
        }
      ]
    },
    stadium: {
      id: "stadium",
      roomId: "lights",
      title: "Stadium of Chaotic Fans – The Holiday Derby",
      npcName: "Coach Chris 'The Whistle' Winter",
      intro: "I've got a crucial tactical question for you. Answer correctly, and you'll score a festive hat-trick!",
      question: "What's the true winning strategy for enjoying the Christmas Derby match?",
      options: [
        {
          text: "Cheer for your team, respect other fans, share snacks, and enjoy the atmosphere together.",
          correct: true,
          successMsg: "That's the spirit! Teamwork, fair play, and shared snacks – GOOOOAL! ✅",
          failMsg: ""
        },
        {
          text: "Scream at the referee so loudly that Santa adds you to the 'naughty' list twice.",
          correct: false,
          successMsg: "",
          failMsg: "That's a straight red card from the Spirit of Christmas. Try again! ❌"
        },
        {
          text: "Run onto the field in a full Christmas tree costume and try to substitute yourself.",
          correct: false,
          successMsg: "",
          failMsg: "The crowd collectively facepalms at you. Try again! ❌"
        }
      ]
    },
    market: {
      id: "market",
      roomId: "cookies",
      title: "Christmas Market – The Glorious Final Boss of Cosiness",
      npcName: "Mara the Mug Master",
      intro: "Before I serve the ultimate hot chocolate, answer this question. Don't worry, it's sweeter than my marshmallows!",
      question: "What is the best way to use your Christmas time?",
      options: [
        {
          text: "Spend time with people you care about, relax, enjoy small moments with GLÜHWEIN and laughter.",
          correct: true,
          successMsg: "Yes! That's the true recipe: good people, good vibes, and hot chocolate. ✅",
          failMsg: ""
        },
        {
          text: "Lock yourself in your room and attempt a 72-hour speedrun of 'Clean the Entire House'.",
          correct: false,
          successMsg: "",
          failMsg: "That answer tastes like overcooked Brussels sprouts. Try again! ❌"
        },
        {
          text: "Develop a 500-slide PowerPoint on 'Q4 Performance of Santa's Reindeer – A Synergistic Deep Dive'.",
          correct: false,
          successMsg: "",
          failMsg: "PowerPoint won't help here. Let's keep Christmas genuine. Try again! ❌"
        }
      ]
    }
  };

  let completedEvents = new Set();

  window.EventSystem = {
    EVENTS,
    startEvent(eventId) {
      return EVENTS[eventId] || null;
    },
    answerQuestion(eventId, optionIndex) {
      const event = EVENTS[eventId];
      if (!event || optionIndex < 0 || optionIndex >= event.options.length) {
        return null;
      }

      const option = event.options[optionIndex];
      const result = {
        correct: option.correct,
        message: option.correct ? option.successMsg : option.failMsg,
        eventId: eventId
      };

      if (option.correct) {
        completedEvents.add(eventId);
      }

      return result;
    },
    getCompletedEvents() {
      return Array.from(completedEvents);
    },
    isAllEventsCompleted() {
      return completedEvents.size === Object.keys(EVENTS).length;
    }
  };

  // Safe register
  if (typeof window.registerModule === "function") {
    window.registerModule('events');
  }
})();
