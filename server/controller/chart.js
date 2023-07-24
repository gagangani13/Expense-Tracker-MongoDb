const { default: mongoose } = require("mongoose");
const Expense = require("../model/expense");
module.exports.chart = async (req, res) => {
  const year = req.query.year;
  const month = req.query.month;
  const userId = new mongoose.Types.ObjectId(req.userId);
  const pipeline = [
    {
      $match: {
        UserId: userId,
      },
    },
    {
      $project: {
        year: { $year: "$date" },
      },
    },
    {
      $group: {
        _id: "$year",
      },
    },
    { $sort: { _id: -1 } },
  ];
  const uniqueYearsResult = await Expense.aggregate(pipeline);
  const uniqueYearsArray = [...uniqueYearsResult.map((result) => result._id)];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (
    year &&
    uniqueYearsArray.includes(Number(year)) &&
    typeof month === "string" &&
    monthNames.includes(month)
  ) {
    const monthIndex = monthNames.indexOf(month) + 1;

    const startDate = new Date(Number(year), monthIndex - 1, 1);
    const endDate = new Date(Number(year), monthIndex, 0);

    const dataResult = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          UserId: userId,
        },
      },
      {
        $group: {
          _id: { date: "$date", category: "$category" },
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const uniqueDatesSet = new Set(
      dataResult.map((data) => data._id.date.getTime())
    );

    const xAxisArray = Array.from(uniqueDatesSet).map((time) => new Date(time));
    xAxisArray.sort((a, b) => a.getTime() - b.getTime());
    const meArray = fillZeroesForCategory("Me", xAxisArray, dataResult);
    const familyArray = fillZeroesForCategory("Family", xAxisArray, dataResult);
    const friendsArray = fillZeroesForCategory(
      "Friends",
      xAxisArray,
      dataResult
    );

    const monthsData = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(Number(year), 0, 1),
            $lte: new Date(Number(year), 11, 31),
          },

          UserId: userId,
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthsArray = monthsData
      .filter((data) => data.totalAmount !== 0)
      .map((data) => monthNames[data._id.month - 1]);

    function fillZeroesForCategory(categoryName, datesArray, dataResult) {
      const amountByDateAndCategory = new Map(
        dataResult
          .filter((data) => data._id.category === categoryName)
          .map((data) => [data._id.date.getTime(), data.amount])
      );

      return datesArray.map((date) => {
        const amount = amountByDateAndCategory.get(date.getTime());
        return amount !== undefined ? amount : 0;
      });
    }

    try {
      res.send({
        ok: true,
        xAxisArray: xAxisArray.map(
          (day) =>
            monthNames[new Date(day).getMonth()] + " " + new Date(day).getDate()
        ),
        meArray,
        familyArray,
        friendsArray,
        uniqueYearsArray,
        monthsArray,
        year,
        month,
      });
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch!!" });
    }
  } else if (
    year &&
    uniqueYearsArray.includes(Number(year)) &&
    month &&
    !monthNames.includes(month)
  ) {
    const dataResult = await Expense.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $year: "$date" }, Number(year)],
          },
          UserId: userId,
        },
      },
      {
        $project: {
          month: { $month: "$date" },
          category: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", category: "$category" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          categories: {
            $push: {
              category: "$_id.category",
              totalAmount: "$totalAmount",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const meArray = Array(12).fill(0);
    const familyArray = Array(12).fill(0);
    const friendsArray = Array(12).fill(0);
    dataResult.forEach((result) => {
      const monthIndex = result._id - 1;
      result.categories.forEach((categoryData) => {
        if (categoryData.category === "Me") {
          meArray[monthIndex] = categoryData.totalAmount;
        } else if (categoryData.category === "Family") {
          familyArray[monthIndex] = categoryData.totalAmount;
        } else if (categoryData.category === "Friends") {
          friendsArray[monthIndex] = categoryData.totalAmount;
        }
      });
    });

    try {
      res.send({
        ok: true,
        xAxisArray: monthNames.filter(
          (_, idx) => meArray[idx] || familyArray[idx] || friendsArray[idx]
        ),
        meArray: meArray.filter(
          (_, idx) => meArray[idx] || familyArray[idx] || friendsArray[idx]
        ),
        familyArray: familyArray.filter(
          (_, idx) => meArray[idx] || familyArray[idx] || friendsArray[idx]
        ),
        friendsArray: friendsArray.filter(
          (_, idx) => meArray[idx] || familyArray[idx] || friendsArray[idx]
        ),
        uniqueYearsArray,
        monthsArray: monthNames.filter(
          (_, idx) => meArray[idx] || familyArray[idx] || friendsArray[idx]
        ),
        year,
        month: "Month",
      });
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch" });
    }
  } else {
    const pipeline = [
      {
        $match: {
          UserId: userId,
        },
      },
      {
        $project: {
          year: { $year: "$date" },
          category: 1,
          amount: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", category: "$category" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          categories: {
            $push: {
              category: "$_id.category",
              totalAmount: "$totalAmount",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ];
    const dataResult = await Expense.aggregate(pipeline);

    const xAxisArray = dataResult.map((result) => result._id);

    const fillZerosForCategory = (categoryName) => {
      return dataResult.map(
        (result) =>
          result.categories.find(
            (categoryData) => categoryData.category === categoryName
          )?.totalAmount || 0
      );
    };

    const meArray = fillZerosForCategory("Me");
    const familyArray = fillZerosForCategory("Family");
    const friendsArray = fillZerosForCategory("Friends");

    try {
      res.send({
        ok: true,
        xAxisArray,
        meArray,
        familyArray,
        friendsArray,
        uniqueYearsArray,
        monthsArray: [],
        year: "Year",
        month: "Month",
      });
    } catch (error) {
      res.send({ ok: false, error: "Failed to fetch!!" });
    }
  }
};

