var user = {
	id: 888,
	name: 'JerryHong',
	courseLists: [
		{
			name: 'My Courses',
			courses: [
				{
					id: 511019,
					title: 'React for Beginners',
					coverPng:
						'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
					tags: [{ id: 1, name: 'JavaScript' }],
					rating: 5,
				},
				{
					id: 511020,
					title: 'Front-End automat workflow',
					coverPng:
						'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
					tags: [{ id: 2, name: 'gulp' }, { id: 3, name: 'webpack' }],
					rating: 4,
				},
			],
		},
		{
			name: 'New Release',
			courses: [
				{
					id: 511022,
					title: 'Vue2 for Beginners',
					coverPng:
						'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
					tags: [{ id: 1, name: 'JavaScript' }],
					rating: 5,
				},
				{
					id: 511023,
					title: 'Angular2 for Beginners',
					coverPng:
						'https://res.cloudinary.com/dohtkyi84/image/upload/v1481226146/react-cover.png',
					tags: [{ id: 1, name: 'JavaScript' }],
					rating: 4,
				},
			],
		},
	],
}

// 取出所有rating为5的课程
let arr = []

user.courseLists.forEach(list => {
	list.courses
		.filter(course => course.rating === 5)
		.forEach(course => arr.push(course))
})

console.log(arr)

Array.prototype.concatAll = function() {
	let result = []
	this.forEach(function(arr) {
		result.push.apply(result, arr)
	})
	return result
}

const arr1 = user.courseLists
	.map(list => {
		return list.courses.filter(course => course.rating === 5)
	})
	.concatAll()

console.log(arr1)
