var courseLists = [
	{
		name: 'My Courses',
		courses: [
			{
				id: 511019,
				title: 'React for Beginners',
				covers: [
					{
						width: 150,
						height: 200,
						url: 'http://placeimg.com/150/200/tech',
					},
					{
						width: 200,
						height: 200,
						url: 'http://placeimg.com/200/200/tech',
					},
					{
						width: 300,
						height: 200,
						url: 'http://placeimg.com/300/200/tech',
					},
				],
				tags: [
					{
						id: 1,
						name: 'JavaScript',
					},
				],
				rating: 5,
			},
			{
				id: 511020,
				title: 'Front-End automat workflow',
				covers: [
					{
						width: 150,
						height: 200,
						url: 'http://placeimg.com/150/200/arch',
					},
					{
						width: 200,
						height: 200,
						url: 'http://placeimg.com/200/200/arch',
					},
					{
						width: 300,
						height: 200,
						url: 'http://placeimg.com/300/200/arch',
					},
				],
				tags: [
					{
						id: 2,
						name: 'gulp',
					},
					{
						id: 3,
						name: 'webpack',
					},
				],
				rating: 5,
			},
		],
	},
	{
		name: 'New Release',
		courses: [
			{
				id: 511022,
				title: 'Vue2 for Beginners',
				covers: [
					{
						width: 150,
						height: 200,
						url: 'http://placeimg.com/150/200/nature',
					},
					{
						width: 200,
						height: 200,
						url: 'http://placeimg.com/200/200/nature',
					},
					{
						width: 300,
						height: 200,
						url: 'http://placeimg.com/300/200/nature',
					},
				],
				tags: [
					{
						id: 1,
						name: 'JavaScript',
					},
				],
				rating: 5,
			},
			{
				id: 511023,
				title: 'Angular2 for Beginners',
				covers: [
					{
						width: 150,
						height: 200,
						url: 'http://placeimg.com/150/200/people',
					},
					{
						width: 200,
						height: 200,
						url: 'http://placeimg.com/200/200/people',
					},
					{
						width: 300,
						height: 200,
						url: 'http://placeimg.com/300/200/people',
					},
				],
				tags: [
					{
						id: 1,
						name: 'JavaScript',
					},
				],
				rating: 5,
			},
		],
	},
]

Array.prototype.concatAll = function() {
	let result = []
	this.forEach(function(arr) {
		result.push.apply(result, arr)
	})
	return result
}

//不得使用covers[0]
//没想到在不使用covers[0]是在写层循环，感觉会了点什么。。。

let arr = courseLists
	.map(courseList =>
		courseList.courses
			.map(course => {
				return course.covers
					.filter(cover => cover.width === 150)
					.map(cover => {
						return {
							id: course.id,
							title: course.id,
							url: cover.url,
						}
					})
			})
			.concatAll()
	)
	.concatAll()

console.log(arr, '????')
