# Plinko Probability - implementation notes

The Galton Board is created with all of the possible pegs.
Each of the pegs is given a row and a column and are evenly spaced.
The peg separation is determined by the number of rows displayed.

There is a Ball object with the knowledge of its position and intended position.
When an ball instance is created we generate a probability for a path.
Depending on this probability, the ball has some chance of going left of right.
Using random numbers the ball stores the path that it will take and saves it for later use.
The ball 'knows' from the moment it is created which bin it is going to land in.

A ball's motion is divided into four phases, as documented in BallPhase.
As the step function gets called, the ball goes through each of the four phases, updating it's position based
on the path that it 'chose' at its creation. Finally, it ends up at the histogram and it is added to the
statistics of the histogram.

The display of balls is optimized using CanvasNode, see BallsNode.
A single ball image (scaled to fit the space between pegs on the Galton board) is used
to render all balls.

The histogram holds all of the statistics of the model.
It also holds an array, where each element is the number of balls in a bin.
Each time a ball exits the Galton Board, one of the bins is incremented by one.
These numbers are then used to calculate the mean, variance, standard deviation.

The view model takes the position of the model ball, transforms it and makes the view appear.



