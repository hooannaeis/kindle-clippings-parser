---
title: "Building an Anonymization Pipeline"
author: "Luk;Emam, Khaled El Arbuckle"
last_interaction: "2024-04-06T14:46:21.000Z"
---


This book has been organized around a few points along the identifiability spectrum based on three main states of data: identified, pseudonymized, and anonymized.

Identified data carries the most risk, and the most privacy and data protection obligations.

The legal term pseudonymization simply means that direct identifiers have been removed in some way, as a data protection mechanism. Any additional information required to re-identify is kept separate and is subject to technical and administrative (or organizational) controls.

For a good discussion of the debates about anonymization, and different viewpoints, we recommend everyone read Ira Rubinstein and Woodrow Hartzog, “Anonymization and Risk,” Washington Law Review 91, no. 2 (2016): 703–60, https://oreil.ly/Yrzj6.

A more practical and realistic approach than striving for zero risk is to focus on the process of minimizing risk, considering anonymization as a risk-management process. This is the approach taken, for example, by the HITRUST Alliance, which provides a framework allowing organizations to meet the privacy requirements of multiple regulations and standards.

Guidance on the topic of anonymization is almost always risk based, providing a scalable and proportionate approach to compliance.

Reducing identifiability to a level in which it becomes nonpersonal is, by its very nature, technical, using a blend of statistics, computer science, and risk assessment.

We need to distinguish between what is possible and what is probable, otherwise we would spend our lives crossing the street in fear of a plane being dropped on our heads (possible, but not probable).

HIPAA, mentioned earlier in the chapter, includes in its Privacy Rule a method known as Safe Harbor that uses a fixed list of 18 identifiers that need to be transformed.18 This list includes many directly identifying pieces of information that need to be removed, such as name and Social Security number. Individual-level dates must be limited to year only, and the method also places limits on the accuracy of geographic information.

Chapter 2. Identifiability Spectrum

Reasonableness is judged based on what is practical and realistic at the time of processing (the operations performed on data), while excluding the highly unlikely, even impossible, or that which is prohibited by law.

Indirect identifiers are also referred to as quasi-identifiers in the computational disclosure control literature, and as key variables in the statistical disclosure control literature.

Types of Disclosure

Identity disclosure Re-identification occurs when an individual’s identity can be attached to some data, either alone or in combination with other information.

Attribute disclosure Attribution occurs when sensitive information is associated with an individual or group in the data.

Inferential disclosure Inference occurs when it’s possible to learn something new about an individual or group in the data more accurately than would have otherwise been possible.

Attribution or inference essentially means “learning something new” about data subjects. If re-identification takes place without learning something new, there is no actual privacy issue in practice.

There are four dimensions of data privacy that we’re concerned with in this book: linkability, addressabilty, identifiability, and inference.

For example, if all of the medical records that belong to the same patient have the same pseudonymized ID, it’s possible to link all of them together and construct a longitudinal profile of that individual. The individual may or may not be identifiable. Identifiability is entirely independent of linkability.

Addressability is when you have a pseudonym that can be used to target or “address” a specific individual (not necessarily an “identifiable individual”). For instance, a pseudonym can be used directly or indirectly to target advertisements to a specific individual or an individual’s device.

There are many pieces we can unpack to go from sharing data to being able to successfully re-identify a data subject, as this will go to the heart of how we measure identifiability. Spoiler alert! It will require an assessment of the environment and the circumstances in which the data will be shared, and an assessment of the data itself.

Re-identification science The study and analysis of the distribution (who, when, and where) patterns, and determinants (or risk factors) of identifiability conditions in defined populations.

As was just described, there are two directions in which an adversary can try to re-identify an individual in a data set: from sample to population, and from population to sample.

The structure of data will define specific relationships and associations between attributes of data, the correlation structures, that are important for analysis purposes. While we may not need to consider these exact correlation structures in how we assess identifiability, it’s important to understand them so that we maintain them where they do not affect identifiability, and produce high degrees of data utility during the anonymization process.

The overall level of identifiability is a function of both the data and context of sharing that data, as summarized in Figure 2-7

One framework that has gained popularity after more than a decade of use is known as the Five Safes,2 which is intended to capture the relevant dimensions to assess the context and results of a data sharing scenario in an effort to make sound decisions. Those dimensions are: Safe Projects, Safe People, Safe Settings, Safe Data, and Safe Outputs.

For a good book on the basics of data governance, see Morgan Templar, Get Governed: Building World Class Data Governance Programs (Rescue, CA: Ivory Lady Publishing, 2017), https://oreil.ly/PKD0h.

We wrote a short practice article of this process in Luk Arbuckle and Felix Ritchie, “The Five Safes of Risk-Based Anonymization,” IEEE Security & Privacy 17, no. 5 (October 2019): 84–89, https://oreil.ly/xi24Y. 4 We use the word “approval” rather than “consent,” because the latter can have very specific conditions and interpretations associated with it based on the relevant privacy laws.

If you are sharing with a third party for a secondary purpose, ask yourself if data subjects would be surprised or upset with third-party access to information about them. This will depend on the third party, cultural norms, and, ultimately, trust (between data subjects and the third party, but also between data subjects and your organization).

Probing Questions to Understand Data Flows

What are the data flows, from source to recipient access or use, including all data transfers and points where data transformation may occur?

Categories of information

Directly identifying Attributes that can essentially be used alone to uniquely identify individuals or their households, such as names and known identifiers. These should only be kept for identified data, and even then you may choose to separate directly identifying attributes into a separate dataset that is linkable to the other personal data.

Indirectly identifying Attributes that can be used in combination with one another to identify individuals, such as known demographics and events, may need to be modified or transformed to reduce risk. These are the attributes used to measure identifiability, and are not immediately removed from the shared data because they are extremely useful for analytics.

We can divide these into two classes, which generally have different levels of risk: Knowable to the public, such as fixed demographics Knowable to an acquaintance, such as encounter dates and longitudinal characteristics or events

Confidential or target data Attributes that are not identifiable but would be learned from working with the data, such as behaviors and preferences. Target data may still be found in data that is anonymized, and can pose ethical considerations regarding its use. Often, when classifying personal data as identifying or not, everything that is not identifying is considered target data.

Probing Questions to Understand Data and Data Subjects

Describe the structure and properties of the data. Wants versus needs for analysis and research using the data collected? Expected data retention period? Do the attributes collected support the purpose for collection and processing? Is the data highly detailed, is it highly sensitive and personal in nature?

Describe the identifiability of attributes, including from inferences, and what may not actually constitute personal data. What is directly identifying versus indirectly identifying? What is confidential, or a target, besides the identifiable data? What is nonpersonal, i.e., not about a data subject?

Pseudonymization was introduced recognizing that identifiability exists on a spectrum, and that there are benefits to encouraging the processing of less identifiable data.

Tip Avoid using the grounds of legitimate interests (or equivalent, depending on the relevant jurisdiction) if the processing will “surprise” people in some way. It needs to be something they can understand and will reasonably expect that they would agree to if it were explained to them.

But keep in mind that you will also be required to prove the processing is necessary and cannot be done using less identifiable data.

“Comparing the Benefits of Pseudonymisation and Anonymisation Under the GDPR,” Journal of Data Protection & Privacy 2, no. 2 (2018): 145-158, https://oreil.ly/cA4zG.

Basic pseudonymization Direct identifiers are replaced or removed through masking, and any additional information required to re-identify is kept separate and is subject to technical and administrative (or organizational) controls. Strong pseudonymization Direct identifiers are replaced or removed through masking, indirect identifiers that are knowable to the public are transformed to ensure that data subjects are not unique in the target population so that they can’t be singled out, and any additional information required to re-identify is destroyed if required, or kept separate and is subject to technical and administrative (or organizational) controls.

This metadata would be used to supplement and inform the risk-based anonymization strategies derived from the frequency counts. Figure 6-3. A multistage anonymization pipeline from raw source to intermediate anonymization, pooling, risk assessment, and final anonymization to share data.
