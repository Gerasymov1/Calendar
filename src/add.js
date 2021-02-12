const form = document.getElementById("addform");
const input = document.querySelector("input");
const participant = document.querySelector("#participant");
const day = document.querySelector("#day");
const time = document.querySelector("#time");
const formData = {
  members: [],
  date: "",
  time: "",
  event: "",
  id: null,
};

const createErrorMessage = () => {
  const div = document.createElement("div");
  div.className = "error";
  const span = document.createElement("span");
  span.innerText = "Error! Time slot is already booked";
  div.append(span);
  document.querySelector(".error-container").append(div);
};

form.addEventListener("submit", (e) => {
  const currentDataFromStorage = JSON.parse(localStorage.getItem("data"));

  const eventName = input.value;
  const selectedOptionDate = day.options[day.selectedIndex].text;
  const selectedOptionTime = time.options[time.selectedIndex].text;
  const selectedMembers = [...participant.options]
    .filter((member) => member.selected)
    .map((member) => {
      return {
        name: member.text,
      };
    });

  const maxId = currentDataFromStorage.length
    ? currentDataFromStorage.reduce((acc, val) => {
        return acc.id > val.id ? acc.id : val.id + 1;
      })
    : 1;

  formData.members = selectedMembers;
  formData.date = selectedOptionDate;
  formData.time = selectedOptionTime;
  formData.event = eventName;
  formData.id = maxId;

  const isCalendarSlotReserved = currentDataFromStorage.some(
    (elem) => elem.time === formData.time && elem.date === formData.date
  );

  if (!isCalendarSlotReserved) {
    currentDataFromStorage.push(formData);
    return localStorage.setItem("data", JSON.stringify(currentDataFromStorage));
  } else {
    e.preventDefault(e);
    const div = document.querySelector(".error-container");
    div.innerHTML = "";
    createErrorMessage();
  }
});
