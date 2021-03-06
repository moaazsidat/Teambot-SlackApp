var admin = require("firebase-admin");

var serviceAccount = require("./teambot-68704-firebase-adminsdk-inu4i-8189c53812.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teambot-68704.firebaseio.com"
});

const HACKATHON = "Hack the North";
const auth = admin.auth();
const db = admin.database();
const userRef = db.ref('users');
const teamRef = db.ref(`teams/${HACKATHON}`);
const memRef = db.ref(`members/${HACKATHON}`);

// Update user
function updateUser(userId, data, callback) {
  /*
  Keyword Arguments:
    username -- user's username as a string
    roles -- list of interested roles
    skills -- list of skills and their level from 1 to 5 as an integer
    user_type -- indicates whether looking for a "team" or "member"
    visible -- true if user is visible for search
  */
  userRef.child(userId).set(data).then(() => {
    callback(true);
  }, error => {
    console.error(error);
    callback(false);
  });
}

// Update team
function updateTeam(userId, callback, remove = false) {
  var data = new Date().getTime();
  if(remove) data = null;
  teamRef.child(userId).set(data).then(() => {
    callback(true);
  }, error => {
    console.error(error);
    callback(false);
  });
}

// Update member
function updateMember(userId, callback, remove = false) {
  var data = new Date().getTime();
  if(remove) data = null;
  memRef.child(userId).set(data).then(() => {
    callback(true);
  }, error => {
    console.error(error);
    callback(false);
  });
}

// Update field
function updateField(userId, field, data, callback) {
  userRef.child(`${userId}/${field}`).set(data).then(() => {
    callback(true);
  }, error => {
    console.error(error);
    callback(false);
  }, error => {
    console.error(error);
    callback(false);
  });
}

// Update roles
function updateRoles(userId, roles, callback) {
  updateField(userId, "roles", roles, callback);
}

// Update skills
function updateSkills(userId, skills, callback) {
  updateField(userId, "skills", skills, callback);
}

// Update user type
function updateType(userId, user_type, callback) {
  updateField(userId, "user_type", user_type, callback);
}

// Update visibility
function updateVisibility(userId, visible, callback) {
  updateField(userId, "visible", visible, callback);
}

// Get field
function getField(userId, field, callback) {
  userRef.child(`${userId}/${field}`).once('value').then(snapshot => {
    if (userId !== undefined && snapshot.val())
      callback(true, snapshot.val());
    else
      callback(false, null);
  }, error => {
    console.error(error);
    callback(false, null);
  });
}

// Get user information
function getUserInfo(userId, callback) {
  userRef.child(`${userId}`).once('value').then(snapshot => {
    if (userId !== undefined && snapshot.val())
      callback(true, snapshot.val());
    else
      callback(false, null);
  }, error => {
    console.error(error);
    callback(false, null);
  });
}

// Get roles
function getRoles(userId, callback) {
  getField(userId, "roles", callback);
}

// Get skills
function getSkills(userId, callback) {
  getField(userId, "skills", callback);
}

// Get user type
function getType(userId, callback) {
  getField(userId, "user_type", callback);
}

// Get visibility
function getVisibility(userId, callback) {
  getField(userId, "visible", callback);
}

// Returns true if user is in database
function hasUser(userId, callback) {
  userRef.once('value').then(snapshot => {
    if (userId !== undefined && snapshot.val() && snapshot.hasChild(userId))
      callback(true, snapshot.val()[userId]);
    else
      callback(false, null);
  });
}

// Get teams
function getTeams(callback) {
  teamRef.once('value').then(snapshot =>
    callback(true, snapshot.val()), error => {
      console.error(error);
      callback(false, null);
  });
}

// Get members
function getMembers(callback) {
  memRef.once('value').then(snapshot =>
    callback(true, snapshot.val()), error => {
      console.error(error);
      callback(false, null);
  });
}

// Delete user
function deleteUser(userId, callback) {
  userRef.child(userId).set(null).then(() => callback(true), error => {
    console.error(error);
    callback(false);
  });
  undiscoverUser(userId, success => {});
}

// Remove from member/team list
function undiscoverUser(userId, callback) {
  teamRef.child(userId).set(null).then(() => callback(true), error => {
    console.error(error);
    return callback(false);
  });;
  memRef.child(userId).set(null).then(() => callback(true), error => {
    console.error(error);
    return callback(false);
  });;
}


module.exports = {
  HACKATHON,
  updateUser,
  updateTeam,
  updateMember,
  updateRoles,
  updateSkills,
  updateType,
  updateVisibility,
  getUserInfo,
  getRoles,
  getSkills,
  getType,
  getVisibility,
  hasUser,
  getTeams,
  getMembers,
  deleteUser,
  undiscoverUser
}
