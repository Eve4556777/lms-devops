const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

let courses = [
  { id: 1, title: 'Introducción a DevOps',  instructor: 'Dr. García', credits: 4 },
  { id: 2, title: 'Kubernetes Avanzado',    instructor: 'Ing. López', credits: 3 },
  { id: 3, title: 'Docker y Contenedores',  instructor: 'Mtra. Ruiz', credits: 3 }
];
let nextId = 4;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'course-service' });
});

app.get('/courses', (req, res) => {
  res.json(courses);
});

app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json(course);
});

app.post('/courses', (req, res) => {
  const { title, instructor, credits } = req.body;
  if (!title || !instructor) {
    return res.status(400).json({ error: 'title e instructor son requeridos' });
  }
  const course = { id: nextId++, title, instructor, credits: credits || 3 };
  courses.push(course);
  res.status(201).json(course);
});

app.put('/courses/:id', (req, res) => {
  const idx = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Curso no encontrado' });
  courses[idx] = { ...courses[idx], ...req.body };
  res.json(courses[idx]);
});

app.delete('/courses/:id', (req, res) => {
  const idx = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Curso no encontrado' });
  courses.splice(idx, 1);
  res.json({ message: 'Curso eliminado correctamente' });
});

app.listen(PORT, () => {
  console.log(`course-service corriendo en puerto ${PORT}`);
});