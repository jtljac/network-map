# Network Map
A web application for visualising a network.

## Motivation
There are a fair few options available for drawing up a map of a network, but there doesn't seem to be many to help with
exploring a network. This project aims to create an interactive web application that can be used to browse a network.
Making it easier to find what devices connect to what, and where to find the devices in a real space.

## Planned Features
### Floor plan
[//]: # (TODO: Add image)
A representation of the components on a floor plan of the site. Intended for quickly looking up what devices in a space 
are connected to.

Features:
* Components in the map can be hovered over to highlight connected components
* Components can be dragged and dropped to place them on the floor plan
* Hovering components highlights connections
* Components can be grouped 

### Logical Map
[//]: # (TODO: Add image)
A representation of the components in more of a flow chart. Intended to show a full map of how the devices in the 
network are connected.

Features:
* Components are automatically arranged on the chart.
* Components can be hovered over to quickly show connections
  * Components that forward connections, like patch panels and wall sockets, can be toggled so their connections are
  "Passed through" on hover
* Connections can be edited

### Component View
[//]: # (TODO: Add image)
A Visualisation of a component and it's connections, Intended to quickly show what each port on the device connects to.
