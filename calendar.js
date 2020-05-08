"use strict";

const e = React.createElement;

class CalendarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.humanTime = concatenateStartEnd(this.props.start, this.props.end, 1);
    this.endDate = new Date(this.props.end);
    this.startDate = new Date(this.props.start);
    this.classes =
      "list-group-item btn d-flex justify-content-between align-items-center";
    if (this.props.isAllDay == true) {
      this.classes += " list-group-item-secondary";
    } else if (this.endDate < Date.now()) {
      this.classes += " list-group-item-info";
    } else if (this.startDate < Date.now() && this.endDate > Date.now()) {
      this.classes += " active";
    }
  }

  eventClicked() {
    ipcRenderer.send("async-open-url", this.props.webLink);
  }

  render() {
    return (
      <li
        key="{this.props.id}"
        className={this.classes}
        onClick={this.eventClicked.bind(this)}
      >
        {this.props.subject}
        {this.props.isAllDay == false && (
          <span className="badge badge-primary badge-pill">
            {this.humanTime}
          </span>
        )}
      </li>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const entries = this.props.entries;
    //entries.map((entry) => console.log(entry));
    const calendarItems = entries.map((entry) => (
      <CalendarEntry
        key={entry.id}
        subject={entry.subject}
        start={entry.start}
        end={entry.end}
        isAllDay={entry.isAllDay}
        webLink={entry.webLink}
      ></CalendarEntry>
    ));

    return <ul className="list-group">{calendarItems}</ul>;
  }
}

class NextMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.event = this.props.event;
    this.humanTime = concatenateStartEnd(this.event.start, this.event.end, 1);
    if (this.props.isAllDay == true) {
      this.humanTime = "All Day";
    }
  }

  buttonClicked() {
    ipcRenderer.send("async-open-url", this.event.webLink);
  }

  render() {
    return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          {this.event.subject}
          <span className="badge badge-primary badge-pill">
            {this.humanTime}
          </span>
        </div>
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Attendees</h6>
          <p className="card-text">{this.event.requiredAttendees}</p>
          <button
            onClick={this.buttonClicked.bind(this)}
            className="btn btn-primary"
          >
            Open Meeting
          </button>
        </div>
      </div>
    );
  }
}

function updateCalendar(events) {
  let calContainer = document.getElementById("calendar-container");
  ReactDOM.render(<Calendar entries={events} />, calContainer);
  let meetingContainer = document.getElementById("nextmeeting");
  let currentEntry = null;
  let now = Date();
  for (var i = 0; i < events.length; i++) {
    currentEntry = events[i];
    if (currentEntry.end < now) continue;
    if (currentEntry.end >= now && currentEntry.start < now) break;
  }
  ReactDOM.render(<NextMeeting event={currentEntry} />, meetingContainer);
}

function concatenateStartEnd(start, end, offset) {
  let humanTime = getHumanTime(start, offset) + "-" + getHumanTime(end, offset);
  return humanTime;
}

function getHumanTime(utcTime, offset) {
  let dateObject = new Date(utcTime);
  let stringValue =
    dateObject.getHours() +
    offset + // a weird hack because of DST
    ":" +
    (dateObject.getMinutes() < 10 ? "0" : "") +
    dateObject.getMinutes();
  return stringValue;
}
