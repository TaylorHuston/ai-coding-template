// Test feature for CHANGELOG workflow demonstration
// This simulates a new feature being added

function testFeature() {
    console.log("This is a test feature for demonstrating CHANGELOG workflow");
    return {
        status: "success",
        message: "Feature working correctly"
    };
}

module.exports = { testFeature };