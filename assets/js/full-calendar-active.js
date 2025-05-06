/*-------------------------------------------
  full-calendar
  --------------------------------------------- */
  var srcElement = null;
    function dragStart(t) {
        (srcElement = this), (t.dataTransfer.effectAllowed = "move"), t.dataTransfer.setData("text/html", this.outerHTML), this.classList.add("dragged");
    }
    function dragOver(t) {
        return t.preventDefault && t.preventDefault(), this.classList.add("over"), (t.dataTransfer.dropEffect = "move"), !1;
    }
    function dragEnter(t) {}
    function dragLeave(t) {
        this.classList.remove("over");
    }
    function elementDrop(t) {
        if ((t.stopPropagation && t.stopPropagation(), srcElement != this)) {
            this.parentNode.removeChild(srcElement);
            var e = t.dataTransfer.getData("text/html");
            this.insertAdjacentHTML("beforebegin", e), addDnDHandlers(this.previousSibling);
        }
        return this.classList.remove("over"), !1;
    }
    function dragEnd(t) {
        this.classList.remove("over");
    }
    function addDnDHandlers(t) {
        t.addEventListener("dragstart", dragStart, !1),
            t.addEventListener("dragenter", dragEnter, !1),
            t.addEventListener("dragover", dragOver, !1),
            t.addEventListener("dragleave", dragLeave, !1),
            t.addEventListener("drop", elementDrop, !1),
            t.addEventListener("dragend", dragEnd, !1);
    }
    var cols = document.querySelectorAll(".drag-drop .draggable");
   
    !(function (t) {
        t("#external-events .fc-event").each(function () {
            t(this).data("event", { title: t.trim(t(this).text()), stick: !0 }), t(this).draggable({ zIndex: 999, revert: !0, revertDuration: 0 });
        });
        new Date();
        let e = {
                id: 1,
                events: [
                    { id: "1", start: moment().format("YYYY-MM-17") + "T08:30:00", title: "Chamber 201" },
                    { id: "2", start: moment().format("YYYY-MM-DD") + "T10:30:00", end: moment().format("YYYY-MM-DD") + "T12:00:00", title: "Chamber 201" },
                ],
                className: "primary",
                textColor: "#5F63F2",
            },
            n = { id: 2, events: [{ id: "1", start: moment().format("YYYY-MM-20") + "T01:00:00", title: "Meeting" }], className: "secondary", textColor: "#FF69A5" },
            a = { id: 3, events: [{ id: "1", start: moment().format("YYYY-MM-DD") + "T18:30:00", title: "Meeting" }], className: "success", textColor: "#20C997" },
            i = {
                id: 4,
                events: [
                    { id: "1", start: moment().format("YYYY-MM-25") + "T11:00:00", title: "Round" },
                    { id: "2", start: moment().format("YYYY-MM-DD") + "T07:00:00", end: moment().format("YYYY-MM-DD") + "T08:30:00", title: "Round" },
                ],
                className: "warning",
                textColor: "#FA8B0C",
            };
        document.addEventListener("DOMContentLoaded", function () {
            var l = document.getElementById("full-calendar");
            if (l) {
                var o = new FullCalendar.Calendar(l, {
                    headerToolbar: { left: "today,prev,title,next", right: "timeGridDay,timeGridWeek,dayGridMonth,listMonth" },
                    views: { listMonth: { buttonText: "Schedule", titleFormat: { month: "short", weekday: "short" } } },
                    listDayFormat: !0,
                    listDayAltFormat: !0,
                    allDaySlot: !1,
                    editable: !0,
                    eventSources: [e, n, a, i],
                    contentHeight: 800,
                    initialView: "timeGridDay",
                    eventDidMount: function (e) {
                        t(".fc-list-day").each(function () {});
                    },
                    eventClick: function (e) {
                        console.log(e.event.title);
                        let n = t("#e-info-modal");
                        n.modal("show"), console.log(n.find(".e-info-title")), n.find(".e-info-title").text(e.event.title);
                    },
                });
                let r = document.getElementById("draggable-events");
                new FullCalendar.Draggable(r, {
                    itemSelector: ".draggable-event-list__single",
                    eventData: function (e) {
                        return { title: e.innerText, className: t(e).data("class") };
                    },
                });
                o.render(), t(".fc-button-group .fc-listMonth-button").prepend('<i class="fas fa-list-ul"></i>');
            }
        });
    })(jQuery);