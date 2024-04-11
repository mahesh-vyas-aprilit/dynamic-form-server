const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
};

const writeFile = async (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const filePath = path.join(__dirname, "public", "formFields.json");

app.get("/formFields", async (req, res) => {
  try {
    const data = await readFile(filePath);
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error reading file" });
  }
});

app.put("/formFields", async (req, res) => {
  try {
    await writeFile(filePath, JSON.stringify({ data: req.body }));
    res.status(200).json({ message: "File updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating file" });
  }
});

app.delete("/formFields", async (req, res) => {
  try {
    const formData = await readFile(filePath);

    const { fieldId, conditionId } = req.body;

    const currentField = formData.data.find((field) => field.id === fieldId);

    if (!currentField) {
      res.status(404).json({ error: "Field not found" });
    }

    currentField.conditions = currentField.conditions.filter(
      (condition) => condition.id !== conditionId
    );

    await writeFile(filePath, JSON.stringify(formData));
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting file" });
  }
});

app.listen(54321, () => {
  console.log("Server is running on port 54321");
});
