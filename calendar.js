"use strict";

const e = React.createElement;

class CalendarEntry extends React.Component {
  constructor(props) {
    super(props);
    this.startDateObject = new Date(this.props.start);
    this.endDateObject = new Date(this.props.end);
    this.humanTime =
      this.startDateObject.getHours() +
      1 +
      ":" +
      this.startDateObject.getMinutes() +
      "-" +
      (this.endDateObject.getHours() + 1) +
      ":" +
      this.endDateObject.getMinutes();
    this.classes =
      "list-group-item d-flex justify-content-between align-items-center";
    if (this.props.isAllDay == true) {
      this.classes += " active";
    }
  }
  render() {
    return (
      <li key="{this.props.id}" className={this.classes}>
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
      ></CalendarEntry>
    ));

    return <ul className="list-group">{calendarItems}</ul>;
  }
}

class NextMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.event = this.props.event;
    //console.log(this.event);
    this.startDateObject = new Date(this.event.start);
    this.endDateObject = new Date(this.event.end);
    this.humanTime =
      this.startDateObject.getHours() +
      1 +
      ":" +
      this.startDateObject.getMinutes() +
      "-" +
      (this.endDateObject.getHours() + 1) +
      ":" +
      this.endDateObject.getMinutes();
    if (this.props.isAllDay == true) {
      this.humanTime = "All Day";
    }
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
          <a
            target="_blank"
            href={this.event.webLink}
            className="btn btn-primary"
          >
            Open Meeting
          </a>
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
