import React, { useEffect, useState } from "react";
import { getProfiles } from "../../firebase";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     maxWidth: 345,
//     margin: "auto",
//     // marginBottom: theme.spacing(3),
//   },
//   avatar: {
//     // backgroundColor: theme.palette.primary.main,
//   },
//   actions: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
// }));

const demo_profiles = [
  {
    name: "John Doe",
    age: 28,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "https://picsum.photos/200",
  },
  {
    name: "Jane Doe",
    age: 25,
    bio: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://picsum.photos/200",
  },
];
// const getProfiles = () => demo_profiles;
const Match = () => {
  // const classes = useStyles();
  const profiles = demo_profiles;
  // const [profiles, setProfiles] = useState([]);
  // useEffect(() => {
  //   getProfiles("students").then((students) => {
  //     console.log({ students });
  //     setProfiles(students);
  //   });
  // }, []);
  // const { name, age, bio, image } = profiles[0];
  return (
    <div className="content row justify-content-center">
      <div className="col-12">found matchs {profiles?.length}</div>
      <div className="profiles d-flex flex-column gap-5 col-md-6 col-xs-12">
        {profiles?.map((profile) => (
          <div className="d-flex h-300 bg-white text-align-left p-3 rounded-3">
            <div className="profile-content flex-grow text-black w-100 d-flex flex-column">
              <h2 className="p-l-0">profile.name</h2>
              <span>{profile.age}.</span>
              <span>Lorem, ipsum dolor.</span>
              <span>Lorem, ipsum dolor.</span>
            </div>
            <img src={profile.image} alt="profilee" className="flex-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;
