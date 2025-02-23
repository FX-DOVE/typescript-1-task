type User = {
  id: number;
  name: string;
  age: number;
  type: 'user'; // Specifies that this object is a User
};

type Admin = {
  id: number;
  name: string;
  role: string;
  type: 'admin'; // Specifies that this object is an Admin
};

type Person = User | Admin; // A Person can be either a User or an Admin
type PersonType = Person['type']; // Restricts personType to 'user' or 'admin'

// Define a criteria type that allows filtering without the 'type' property
type Criteria<T> = Partial<Omit<T, 'type'>>;

function filterPersons<T extends Person>(
  persons: Person[], 
  personType: T['type'], 
  criteria: Criteria<T>
): T[] {
  return persons.filter((person): person is T => {
    if (person.type !== personType) return false; // Ensure only the correct type is considered

    return Object.entries(criteria).every(([key, value]) =>
      (person as T)[key as keyof T] === value
    );
  });
}

// Example usage:
const persons: Person[] = [
  { id: 1, name: 'Alice', age: 25, type: 'user' },
  { id: 2, name: 'Bob', role: 'Manager', type: 'admin' },
  { id: 3, name: 'Charlie', age: 30, type: 'user' },
  { id: 4, name: 'Dave', role: 'Supervisor', type: 'admin' },
];

// Filtering users with age 25
const filteredUsers = filterPersons<User>(persons, 'user', { age: 25 });

// Filtering admins with role 'Manager'
const filteredAdmins = filterPersons<Admin>(persons, 'admin', { role: 'Manager' });

console.log(filteredUsers); // Output: [{ id: 1, name: 'Alice', age: 25, type: 'user' }]
console.log(filteredAdmins); // Output: [{ id: 2, name: 'Bob', role: 'Manager', type: 'admin' }]
