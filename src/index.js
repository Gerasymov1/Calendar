import "./styles.less";

const times = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let data = [
  {
    members: [
      {
        name: "Maria",
      },
    ],
    date: "Wednesday",
    time: "13:00",
    event: "Daily Standup",
    id: 1,
  },
  {
    members: [
      {
        name: "Maria",
      },
    ],
    date: "Wednesday",
    time: "14:00",
    event: "Planning session",
    id: 2,
  },
  {
    members: [
      {
        name: "Alex",
      },
    ],
    date: "Friday",
    time: "11:00",
    event: "Retrospective",
    id: 3,
  },
  {
    members: [
      {
        name: "Bob",
      },
    ],
    date: "Tuesday",
    time: "17:00",
    event: "Meeting",
    id: 4,
  },
];
const select = document.querySelector(".select");

const getAllEventsFromStorage = () => {
  const dataFromStorage = localStorage.getItem("data");
  return dataFromStorage ? JSON.parse(dataFromStorage) : [];
};

const syncDataFromLocalStorage = (() => {
  if (getAllEventsFromStorage().length) {
    data = getAllEventsFromStorage();
  } else {
    localStorage.setItem("data", JSON.stringify(data));
  }
})();

const setDaysForCalendar = (() => {
  const mainTr = document.getElementById("main-tr");
  let mainTrChildren = mainTr.querySelectorAll(".main-day");
  mainTrChildren.forEach((item, i) => {
    item.innerText = days[i];
  });
})();

const setTimeForCalendar = (() => {
  const allTr = document.querySelectorAll(".time");
  allTr.forEach((item, i) => {
    item.firstElementChild.innerText = times[i];
  });
})();

const renderCalendarEvent = (num, memberEvent) => {
  const allTh = document.querySelectorAll(".main-day");
  const allTr = document.querySelectorAll(".time");
  allTr.forEach((item) => {
    allTh.forEach((itemI, ind) => {
      if (
        item.firstElementChild.innerText === memberEvent[num].time &&
        itemI.innerText === memberEvent[num].date
      ) {
        const div = document.createElement("div");
        const span = document.createElement("span");
        const deleteSpan = document.createElement("span");
        deleteSpan.innerText = "x";
        deleteSpan.className = "delete-span";
        div.className = "event";
        span.innerText = memberEvent[num].event;
        div.append(span);
        div.append(deleteSpan);
        item.children[ind + 1].append(div);
        deleteSpan.addEventListener("click", () =>
          deleteEventHandler(memberEvent[num].id, memberEvent)
        );
      }
    });
  });
};

const getMemberEvents = (data) => {
  const allTdToClear = document.querySelectorAll(".clear");
  for (let i = 0; i < allTdToClear.length; i++) {
    allTdToClear[i].innerHTML = "";
  }
  for (let i = 0; i < data.length; i++) {
    renderCalendarEvent(i, data);
  }
};
getMemberEvents(data);

const deleteEventHandler = (id, memberEvent) => {
  const modal = document.querySelector(".modal");
  const closeButton = document.querySelector(".close");
  const deleteButton = document.querySelector(".delete");
  modal.style.display = "block";
  deleteButton.addEventListener("click", () => {
    modal.style.display = "none";
    data = memberEvent.filter((item) => item.id !== id);
    const dataForStorage = getAllEventsFromStorage().filter(
      (item) => item.id !== id
    );
    localStorage.setItem("data", JSON.stringify(dataForStorage));
    getMemberEvents(data);
  });
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
};

const changeOption = () => {
  const selectedOptionValue = select.options[select.selectedIndex].value;

  if (selectedOptionValue === "all-members") {
    getMemberEvents(getAllEventsFromStorage());
    return;
  }
  const personData = getAllEventsFromStorage().filter((e) =>
    e.members.find((member) => member.name === selectedOptionValue)
  );
  getMemberEvents(personData);
};

select.addEventListener("change", changeOption);
