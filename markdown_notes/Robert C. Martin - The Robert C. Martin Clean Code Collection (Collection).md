---
title: "The Robert C. Martin Clean Code Collection (Collection)"
author: "Robert C. Martin"
last_interaction: "Freitag, 2. Februar 2024 00:58:50"
---


We’ve all felt the relief of seeing our messy program work and deciding that a working mess is better than nothing. We’ve all said we’d go back and clean it up later. Of course, in those days we didn’t know LeBlanc’s law: Later equals never.

The Boy Scouts of America have a simple rule that we can apply to our profession. Leave the campground cleaner than you found it.5

Use Intention-Revealing Names

Beware of using names which vary in small ways. How long does it take to spot the subtle difference between a XYZControllerForEfficientHandlingOfStrings in one module and, somewhere a little more distant, XYZControllerForEfficientStorageOfStrings?

It is very helpful if names for very similar things sort together alphabetically and if the differences are very obvious, because the developer is likely to pick an object by name without seeing your copious comments or even the list of methods supplied by that class.

Noise words are another meaningless distinction. Imagine that you have a Product class. If you have another called ProductInfo or ProductData, you have made the names different without making them mean anything different. Info and Data are indistinct noise words like a, an, and the.

Use Searchable Names

My personal preference is that single-letter names can ONLY be used as local variables inside short methods. The length of a name should correspond to the size of its scope [N5].

One difference between a smart programmer and a professional programmer is that the professional understands that clarity is king. Professionals use their powers for good and write code that others can understand.

Classes and objects should have noun or noun phrase names like Customer, WikiPage, Account, and AddressParser.

Methods should have verb or verb phrase names like postPayment, deletePage, or save. Accessors, mutators, and predicates should be named for their value and prefixed with get, set, and is according to the javabean standard.

The first rule of functions is that they should be small. The second rule of functions is that they should be smaller than that.

This implies that the blocks within if statements, else statements, while statements, and so on should be one line long. Probably that line should be a function call.

FUNCTIONS SHOULD DO ONE THING. THEY SHOULD DO IT WELL. THEY SHOULD DO IT ONLY.

So, another way to know that a function is doing more than “one thing” is if you can extract another function from it with a name that is not merely a restatement of its implementation [G34].

In order to make sure our functions are doing “one thing,” we need to make sure that the statements within our function are all at the same level of abstraction.

We want every function to be followed by those at the next level of abstraction so that we can read the program, descending one level of abstraction at a time as we read down the list of functions. I call this The Step-down Rule.

“You know you are working on clean code when each routine turns out to be pretty much what you expected.”

The smaller and more focused a function is, the easier it is to choose a descriptive name.

Function Arguments The ideal number of arguments for a function is zero (niladic). Next comes one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible. More than three (polyadic) requires very special justification—and then shouldn’t be used anyway.

In the case of a monad, the function and argument should form a very nice verb/noun pair. For example, write(name) is very evocative. Whatever this “name” thing is, it is being “written.”

In other words, it would be better for appendFooter to be invoked as    report.appendFooter(); In general output arguments should be avoided. If your function must change the state of something, have it change the state of its owning object.

“Don’t comment bad code—rewrite it.” —Brian W. Kernighan and P. J. Plaugher

difference between objects and data structures. Objects hide their data behind abstractions and expose functions that operate on that data. Data structure expose their data and have no meaningful functions

First Law You may not write production code until you have written a failing unit test. Second Law You may not write more of a unit test than is sufficient to fail, and not compiling is failing. Third Law You may not write more production code than is sufficient to pass the currently failing test. These three laws lock you into a cycle that is perhaps thirty seconds long. The tests and the production code are written together, with the tests just a few seconds ahead of the production code.

The BUILD-OPERATE-CHECK2 pattern is made obvious by the structure of these tests. Each of the tests is clearly split into three parts. The first part builds up the test data, the second part operates on that test data, and the third part checks that the operation yielded the expected results.

Classes

The name of a class should describe what responsibilities it fulfills. In fact, naming is probably the first way of helping determine class size. If we cannot derive a concise name for a class, then it’s likely too large.

The Single Responsibility Principle The Single Responsibility Principle (SRP)2 states that a class or module should have one, and only one, reason to change. This principle gives us both a definition of responsibility, and a guidelines for class size. Classes should have one responsibility—one reason to change.

There are three parts to making a commitment.   You say you’ll do it. You mean it. You actually do it.
