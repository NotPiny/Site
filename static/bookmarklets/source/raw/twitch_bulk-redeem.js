async function redeemReward(name) {
    // Find reward menu and click it
    document.querySelector('[aria-label="Bits and Points Balances"]').click();
    await new Promise((resolve)=>{setTimeout(resolve, 500)}); // Delay for menu to open / load

    // Find the text that matches the reward name then find the button responsible for selecting it and then click it
    document.querySelector(`[title="${name}"]`).parentElement.parentElement.querySelector('button').click();
    await new Promise((resolve)=>{setTimeout(resolve, 500)}); // Delay for menu to open / load

    // Click the redeem button
    document.querySelector('[data-test-selector="RewardText"]').parentElement.parentElement.parentElement.parentElement.click();
}

(async () => {
    // Option prompts
    const rewardName = prompt("Input the reward name:");
    if (!rewardName) return alert("Reward name is required.");

    const delay = parseInt(prompt("Enter the delay between redemptions in ms: (Default: 1000)") ?? '1000');
    if (!delay) return alert("Invalid Delay.");

    const amount = parseInt(prompt("Insert the amount to redeem:"));
    if (!amount) return alert("Invalid Amount.");

    // Create a variable to keep track of how many rewards have been redeemed so far (we're in a async environment so relying on i will result in random behavior)
    let completed = 0;

    // Loop through the amount of redemptions and redeem the reward
    for (let i = 0; i < amount; i++) {
        // Call the function defined earlier
        await redeemReward(rewardName);

        // Wait for the delay to pass
        await new Promise((resolve)=>{setTimeout(resolve, delay)});
        completed++; // Increment the completed variable

        if (completed == amount) { // If the amount of redemptions is equal to the amount of redemptions required then alert the user
            alert('Completed redeeming rewards.');
        }
    }
})()