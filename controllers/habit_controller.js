const Habit = require('../models/Habit');

module.exports.load = async function (request, response) {
    try {
        const habits = await Habit.find();
        return response.render('home', { habit_list: habits });
    } catch (error) {
        console.log(error);
    }
}

// This function helps in adding a habit in list.
module.exports.add = async function (request, response) {
    function createHabit() {
        request.body.record_tracker = {};
        request.body.user = "AnyUser";
        console.log(request.body);
        return Habit.create(request.body);
    }

    try {
        await createHabit();
        return response.redirect("back");
    } catch (error) {
        console.log(error);
    }
}

// This function helps in deleting a habit from list.
module.exports.delete = async function (request, response) {
    function findByIdAndDelete() {
        const id = request.query.id;
        return Habit.findByIdAndDelete(id);
    }
    try {
        await findByIdAndDelete();
        return response.redirect("back");
    } catch (error) {
        console.log(error);
    }
}

// Finds a habit by id given in query params and renders it
module.exports.viewhabit = async function (request, response) {
    function viewHabit() {
        const id = request.query.id;
        return Habit.findById(id);
    }

    try {
        const habit = await viewHabit();
        response.render("habit.ejs", { "habit": habit });
    } catch (error) {
        console.log(error);
    }
}

// Finds a habit by id given in query params and returns it's json object
module.exports.fetchhabit = async function (request, response) {
    function fetchHabit() {
        let id = request.query.id;
        return Habit.findById(id);
    }

    try {
        const habit = await fetchHabit();
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(habit));
    } catch (error) {
        console.log(error);
    }
}

// first find an element in database using id
module.exports.updateDates = async function (request, response) {
    const id = request.query.id;
    const date = request.query.date;
    const value = request.query.value;
    try {
        const habit = await Habit.findById(id);
        const r_t = habit.record_tracker;
        if (date in r_t) {
            r_t[date] = value;
        }
        else {
            r_t.set(date, value);
        }
        console.log(r_t);

        try {
            await Habit.updateOne({ "_id": id }, { $set: { record_tracker: r_t } });
            return response.end('{ "status":"success"}');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
}