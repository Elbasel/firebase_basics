const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInButton.onclick = () => {
  auth.signInWithPopup(provider);
};

signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    whenSignedOut.hidden = true;
    whenSignedIn.hidden = false;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3> <p>userId: ${user.uid}</p>`;
  } else {
    whenSignedOut.hidden = false;
    whenSignedIn.hidden = true;
    userDetails.innerHTML = "";
  }
});

const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");
let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = db.collection("things");

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;
      thingsRef.add({
        uid: user.uid,
        randomNumber: Math.random(),
        createdAt: serverTimestamp(),
      });
    };

    unsubscribe = thingsRef
      .where("uid", "==", user.uid)
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${Math.round(doc.data().randomNumber * 1000)}</li>`;
        });
        thingsList.innerHTML = items.join("");
      });
  }
});
