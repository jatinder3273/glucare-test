import React from "react";
import Food1 from "@assets/food1.jpg";
import Food2 from "@assets/food2.jpg";
import Food3 from "@assets/food3.jpg";
import styles from "./HistorySidebar.module.scss";
import Image from "next/image";

function FoodSidebar() {
  const readingValues = [
    {
      time: "10:32am",
      text: "Burger, meat, orange juice",
      images: [Food1, Food2, Food3],
    },
    {
      time: "3:41 pm",
      text: "Soup, bread",
      images: [Food1, Food2],
    },
    {
      time: "7:45 am",
      text: "Scambled eggs",
      images: [Food3],
    },
  ];
  const singleDay = [
    {
      date: "9 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "8 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "7 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "6 Mar, 2022",
      readings: readingValues,
    },
    {
      date: "5 Mar, 2022",
      readings: readingValues,
    },
  ];
  return (
    <div className={styles.historyTables}>
      {singleDay.map((day, index) => (
        <div className={styles.historyTablesFood_day} key={index}>
          <div className={styles.historyTables_date}>{day.date}</div>
          {day.readings.map((reading: any, j) => (
            <div className={styles.historyTablesFood_time} key={j}>
              <span>{reading.time}</span>
              <p>{reading.text}</p>
              <div className={styles.foodImagesWrap}>
                {reading.images.map(
                  (images: any, k: React.Key | null | undefined) => (
                    <span className={styles.image} key={k}>
                      <Image src={images} alt="food"></Image>
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FoodSidebar;
