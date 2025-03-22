const bcrypt = require("bcryptjs");

const enteredPassword = "Kaveesha123@";  // The password you're testing
const storedHash = "$2b$10$wDGZ8ICULr6/RSAtgh8vju5rliJLWc9JjET2ZrAsPcZskSpBRvYiu"; // The hash from MongoDB

bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
    if (err) console.error("Error comparing passwords:", err);
    console.log("Password Match:", isMatch);
});
