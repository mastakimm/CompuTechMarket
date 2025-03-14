# CompuTechMarket


## Getting started

### **1. Install Java 17**

## **Linux**

**Update the system:**

```
sudo apt update
sudo apt upgrade
```

`sudo apt install openjdk-17-jdk`

**Verify the installation:**

`java -version`

Output should show openjdk version "17.x.x".

**Set JAVA_HOME (optional):**

```
echo "export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))" >> ~/.bashrc
source ~/.bashrc
```


## **macOS**

**Install Homebrew (if not already installed):**

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

**Install Java 17:**

`brew install openjdk@17`

**Add Java to PATH:**

```
echo "export PATH=/usr/local/opt/openjdk@17/bin:$PATH" >> ~/.zshrc
source ~/.zshrc
```

**Verify the installation:**

`java -version`

## **Windows**

**Download JDK 17:**

`Go to Oracle Java 17 download page or OpenJDK.`


**Install Java:**

`Run the installer and follow the prompts.`

**Verify the installation:**

**Open Command Prompt (CMD) and run:**

`java -version`

Output should show openjdk version "17.x.x".

**Set JAVA_HOME:**

`Open System Properties > Advanced > Environment Variables.`

```
Add a new JAVA_HOME variable pointing to your JDK installation path (e.g., C:\Program Files\Java\jdk-17).
Add %JAVA_HOME%\bin to the Path variable.
```

### **2. Install Gradle**

## **Linux**

**Download Gradle:**

`wget https://services.gradle.org/distributions/gradle-<version>-bin.zip`

Replace <version> with the desired version (e.g., 8.3).

**Extract Gradle:**

`sudo unzip gradle-<version>-bin.zip -d /opt/gradle`

**Add Gradle to PATH:**

```
echo "export PATH=/opt/gradle/gradle-<version>/bin:$PATH" >> ~/.bashrc
source ~/.bashrc
```


**Verify the installation:**

`gradle -v`

## **macOS**

**Install Gradle using Homebrew:**

`brew install gradle`

**Verify the installation:**

`gradle -v`

## **Windows**

**Download Gradle:**

`Visit Gradle releases and download the binary ZIP for the desired version.`

**Extract Gradle:**

`Extract the ZIP to a directory, e.g., C:\Gradle.`

**Add Gradle to PATH:**

```
Open System Properties > Advanced > Environment Variables.
Add C:\Gradle\gradle-<version>\bin to the Path variable.
```


**Verify the installation:**

**Open Command Prompt (CMD) and run:**

`gradle -v`

**3. Clone the Repository**

**Clone the repository:**

```
git clone git@gitlab.com:thornament/thornament_backend.git
cd thornament_backend
```


### **4. Build and Run the Application**

**Run the Gradle Wrapper:**

**On Linux/macOS:**

`./gradlew build`

**On Windows:**

`gradlew.bat build`

### Run the Application:

**On Linux/macOS:**

`./gradlew bootRun`

**On Windows:**

`gradlew.bat bootRun`

### Access the Application:

**Open your browser and navigate to:**
`http://localhost:8080`

### Access the SwaggerUI:

**Open your browser and navigate to:**
`http://localhost:8080/swagger-ui/index.html`
