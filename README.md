# CSD Museum

**CSD Museum** is a web application that allows users to explore and learn about the history of the Computer Science Department at the University of Crete.

#image{width=100%}
![alt text](https://github.com/epap011/csd-museum/blob/main/cover.png?raw=true)


---

# Getting Started

Follow the steps below to set up and run the application on your machine.

## 1. Install Docker

If you don't have Docker installed, follow the instructions for your system:
- [Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Linux](https://docs.docker.com/engine/install/)

## 2. Clone the Repository
```bash
git clone https://github.com/epap011/csd-museum
```

## 3. Build the Docker Image
```bash
sudo docker build -t csd-museum .
```
## 4. Run the Application
```bash
sudo docker run -d -p 8080:80 csd-museum
```

## 5. Access the Application
Open your web browser and navigate to `http://localhost:8080` to access the CSD Museum application.

**Tip**: For a full-screen experience, you can launch your preferred browser in full-screen mode.

## 6. Stop the Application
```bash
sudo docker ps
sudo docker stop <container_id>
```

# Contributing
Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.
