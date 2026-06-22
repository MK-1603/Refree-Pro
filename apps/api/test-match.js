const id = '0fbeb358-3478-49fa-808c-2565ec38b983';
fetch(`http://localhost:4000/api/v1/matches/${id}`)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
