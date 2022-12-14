import Head from "next/head";
import Banner from "../components/banner/banner";
import SectionCards from "../components/card/section-cards";
import NavBar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";
import {
  getVideos,
  getPopularVideos,
  getWatchItAgainVideos,
} from "../lib/videos";
import redirectUser from "../utils/redirectUser";

export async function getServerSideProps(context) {
  const { token, userId } = await redirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productive work");
  const travelVideos = await getVideos("travel videos");
  const popularVideos = await getPopularVideos();

  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar username="Jeff@hotmail.com" />
        <Banner
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.jpg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch it Again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
