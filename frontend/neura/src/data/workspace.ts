// export const AI_RESPONSE = {
//   original_filename: "1806.01973v1.pdf",
//   extracted_images: [
//     {
//       filename: "img_2_0.png",
//       page_number: 2,
//     },
//     {
//       filename: "img_2_1.png",
//       page_number: 2,
//     },
//     {
//       filename: "img_6_2.png",
//       page_number: 6,
//     },
//     {
//       filename: "img_7_3.png",
//       page_number: 7,
//     },
//     {
//       filename: "img_8_4.png",
//       page_number: 8,
//     },
//     {
//       filename: "img_9_5.png",
//       page_number: 9,
//     },
//     {
//       filename: "img_9_6.png",
//       page_number: 9,
//     },
//     {
//       filename: "img_10_7.png",
//       page_number: 10,
//     },
//   ],
//   study_guide: [
//     {
// id: "",
//       section_title:
//         "Introduction to Web-Scale Graph Convolutional Networks for Recommendation Systems",
//       explanation:
//         "This section introduces the increasing importance of deep learning in recommender systems, particularly using Graph Convolutional Networks (GCNs).  Traditional GCNs have shown promise, but they struggle to scale to the massive datasets of web-scale applications like Pinterest, which involve billions of items and users.  The key challenge is the computational cost of operating on the full graph Laplacian, which becomes infeasible for such large graphs. PinSage is presented as a solution, a scalable GCN framework developed and deployed at Pinterest. It employs random walks and localized graph convolutions to create node embeddings that capture both graph structure and node features.  The authors highlight PinSage's efficiency and effectiveness in handling graphs much larger than those typical for GCN applications, marking a significant step towards practical web-scale graph-based recommendation systems.",
//       associated_image_filenames: [],
//     },
//     {
// id: "",
//       section_title: "Background and Related Work in Graph Neural Networks",
//       explanation:
//         "This section provides context by discussing the evolution of deep learning on graph data. It traces the development from early graph neural network concepts that were computationally expensive to the surge of interest in Graph Convolutional Networks (GCNs). GCNs, originating from spectral graph theory, have become state-of-the-art in various tasks including recommendation. The text mentions approaches like GraphSAGE as being closely related to PinSage.  A key limitation of previous GCN works was their inability to scale to web-scale datasets due to the requirement of operating on the entire graph Laplacian. PinSage aims to overcome this limitation, demonstrating the practical application and impact of GCNs in real-world, large-scale recommender systems.",
//       associated_image_filenames: [],
//     },
//     {
// id: "",
//       section_title: "PinSage Method - Localized Graph Convolutions",
//       explanation:
//         "This section introduces the core methodology of PinSage: localized graph convolutions.  Unlike traditional GCNs that operate on the entire graph Laplacian, PinSage focuses on local neighborhoods to generate node embeddings. This approach is computationally efficient as it avoids processing the entire graph at once.  The method involves applying convolutional modules that aggregate feature information from a node's immediate neighbors in the graph.  By stacking multiple convolutional modules, the model can capture information from increasingly wider network neighborhoods.  Crucially, the parameters of these convolutional modules are shared across all nodes, ensuring that the model's complexity doesn't scale with the size of the graph, making it applicable to massive web-scale graphs.  The concept of localized convolutions, where information is aggregated from a node's neighbors, is visually represented in Figure 1, which is further elaborated in the following sections.",
//       associated_image_filenames: [],
//     },
//     {
// id: "",
//       section_title:
//         "PinSage Model Architecture: Convolution and Minibatch Algorithms",
//       explanation:
//         "This section delves into the algorithmic details of PinSage's architecture.  Algorithm 1, named 'convolve,' and Algorithm 2, 'minibatch,' are central to understanding how PinSage operates. Algorithm 1, as detailed in the text, outlines the core localized convolution operation: it aggregates information from a node's neighbors using learned neural networks and pooling functions to create a new node embedding. Algorithm 2 describes how these convolution operations are stacked and applied in minibatches for efficient processing.  Figure 1, depicted across images like img_6_2.png and img_7_3.png, provides a visual overview of this architecture. As shown in Figure 1 (and specifically illustrated in img_6_2.png), the architecture uses depth-2 convolutions to compute node embeddings by iteratively aggregating information from a node's neighborhood. The right side of Figure 1, potentially further detailed in img_7_3.png, illustrates how a batch of networks is constructed for efficient computation. The concept of 'importance-based neighborhoods' is also crucial; PinSage uses random walks to determine the most influential neighbors for convolution, rather than simply using all neighbors within a fixed hop distance.",
//       associated_image_filenames: ["img_6_2.png", "img_7_3.png"],
//     },
//     {
// id: "",
//       section_title:
//         "Training PinSage: Loss Function, Minibatch Construction, and Optimization Strategies",
//       explanation:
//         "This section explains the training process of PinSage, focusing on key techniques for efficiency and performance. PinSage is trained using a max-margin ranking loss function, as described by Equation 1, which aims to maximize the similarity between embeddings of related items while minimizing the similarity between embeddings of unrelated items. To handle the massive scale of data, PinSage utilizes multi-GPU training with large minibatches and a producer-consumer architecture for minibatch construction. This producer-consumer setup efficiently manages CPU-bound tasks like data preparation and GPU-bound tasks like model computation.  A critical aspect of training is the use of 'hard negative sampling.' As conceptually illustrated in Figure 2 (img_8_4.png), hard negatives are examples that are somewhat related to the query item but less related than the positive example.  Figure 2 (img_8_4.png) shows that hard negative examples are more similar to the query than random negative examples, making the learning task more challenging and ultimately leading to better quality embeddings.  Curriculum training is also employed, starting with easier negative examples and gradually introducing harder ones to improve convergence.",
//       associated_image_filenames: ["img_8_4.png"],
//     },
//     {
// id: "",
//       section_title: "Pinterest Deployment and Performance Evaluation",
//       explanation:
//         "This section highlights the real-world deployment and evaluation of PinSage at Pinterest.  Trained on a graph with billions of nodes and edges representing pins and boards, PinSage was rigorously tested for its recommendation quality. The evaluation included offline metrics, user studies, and A/B tests. The results demonstrated significant improvements over existing methods, with offline metrics showing over 40% improvement, user studies indicating a 60% preference for PinSage recommendations, and A/B tests revealing a 30% to 100% increase in user engagement. These results underscore PinSage's practical effectiveness in a web-scale recommender system. While Figure 3 (img_9_5.png, img_9_6.png, img_10_7.png) provides visual context, possibly showcasing Pinterest content or related data, the text section primarily focuses on the performance metrics and deployment details rather than directly referencing these figures for specific data points or visual explanations.",
//       associated_image_filenames: [],
//     },
//   ],
// };

export const AI_RESPONSE = {
  original_filename: "1806.01973v1.pdf",
  extracted_images: [
    {
      filename: "img_2_0.png",
      page_number: 2,
    },
    {
      filename: "img_2_1.png",
      page_number: 2,
    },
    {
      filename: "img_6_2.png",
      page_number: 6,
    },
    {
      filename: "img_7_3.png",
      page_number: 7,
    },
    {
      filename: "img_8_4.png",
      page_number: 8,
    },
    {
      filename: "img_9_5.png",
      page_number: 9,
    },
    {
      filename: "img_9_6.png",
      page_number: 9,
    },
    {
      filename: "img_10_7.png",
      page_number: 10,
    },
  ],
  study_guide: [
    {
      id: "1",
      section_title:
        "Introduction to Graph Convolutional Networks for Recommender Systems",
      explanation:
        "This section introduces the challenges of scaling deep learning methods, specifically Graph Convolutional Networks (GCNs), to web-scale recommender systems with billions of items and users. Traditional recommendation algorithms like collaborative filtering are being complemented or even replaced by deep models capable of learning low-dimensional embeddings. GCNs, a prominent architecture, aggregate feature information from local graph neighborhoods using neural networks. A single convolution operation transforms and aggregates feature information from a node’s one-hop graph neighborhood, and stacking multiple such convolutions propagates information across the graph. Unlike content-based deep models, GCNs utilize both content information and graph structure. However, scaling GCNs to handle graphs with billions of nodes and edges presents a challenge due to the assumption of operating on the full graph Laplacian during training, which is computationally infeasible for large graphs. The paper introduces PinSage, a highly scalable GCN framework developed and deployed at Pinterest, operating on a graph with 3 billion nodes and 18 billion edges. The key innovations in PinSage include on-the-fly convolutions, producer-consumer minibatch construction, and efficient MapReduce inference. Furthermore, new training techniques such as constructing convolutions via random walks, importance pooling, and curriculum training improve the quality of learned representations, leading to significant performance gains.",
      associated_image_filenames: [],
    },
    {
      id: "2",
      section_title: "PinSage: A Scalable GCN Framework",
      explanation:
        "This section describes the PinSage framework, a random-walk-based GCN designed to operate on massive graphs. Traditional GCN algorithms perform graph convolutions by multiplying feature matrices by powers of the full graph Laplacian. In contrast, PinSage performs efficient, localized convolutions by sampling the neighborhood around a node and dynamically constructing a computation graph from this sampled neighborhood. This eliminates the need to operate on the entire graph during training. The architecture also includes a producer-consumer architecture for constructing minibatches that ensures maximal GPU utilization during model training. The CPU-bound producer efficiently samples node network neighborhoods and fetches the necessary features, while a GPU-bound TensorFlow model consumes these pre-defined computation graphs. An efficient MapReduce pipeline is also designed to distribute the trained model and generate embeddings for billions of nodes, minimizing repeated computations. The framework also incorporates constructing convolutions via random walks and importance pooling. Importance pooling weighs the importance of node features in aggregation based on random-walk similarity measures. A curriculum training scheme is also implemented, where the algorithm is fed harder-and-harder examples during training. These techniques collectively contribute to the scalability and performance of PinSage.",
      associated_image_filenames: [],
    },
    {
      id: "3",
      section_title: "Model Architecture: Localized Graph Convolutions",
      explanation:
        "This section explains the PinSage model architecture focusing on localized graph convolutions. The core concept involves generating embeddings for nodes (items) by applying multiple convolutional modules that aggregate feature information (e.g., visual, textual features) from the node's local graph neighborhood. Each module learns how to aggregate information from a small graph neighborhood, and stacking multiple modules provides information about the local network topology. A key aspect is that the parameters of these localized convolutional modules are shared across all nodes, making the parameter complexity independent of the input graph size.  Figure 1 in img_2_0.png provides an overview of the model architecture. The figure illustrates a small example input graph on the left and the 2-layer neural network on the right, which computes the embedding of a target node (node A) using the previous-layer representation of the node itself and its neighborhood (nodes B, C, and D). The networks share parameters across nodes and layers, and the diagram also illustrates the concept of importance pooling using the function γ. This convolution operation is described in Algorithm 1.",
      associated_image_filenames: ["img_2_0.png"],
    },
    {
      id: "4",
      section_title: "Algorithm 1: The Convolution Operation",
      explanation: `Algorithm 1, described in the text, outlines the convolve operation, which is the core of the PinSage algorithm. This algorithm takes the current embedding of a node u, the embeddings of its neighbors {zv |v ∈ N(u)}, and neighbor weights α as input. It outputs a new embedding znew_u for node u. The algorithm transforms the representations of u's neighbors using a dense neural network and applies an aggregator/pooling function γ (e.g., a weighted sum) on the resulting set of vectors. This aggregation step provides a vector representation nu of u's local neighborhood, N(u). Then, the aggregated neighborhood vector nu is concatenated with u's current representation hu and transformed through another dense neural network layer. The equation for line 1 is $$nu ← γ ({ReLU (Qhv + q) | v ∈ N(u)} ,α);$$ and line 2 is $$znew_u ← ReLU (W · concat(zu, nu) + w);$$. The normalization step $$znew_u ← znew_u /∥znew_u∥_2$$ in line 3 makes training more stable and efficient for nearest neighbor search. The output is a representation of u that incorporates both information about itself and its local graph neighborhood.`,
      associated_image_filenames: [],
    },
    {
      id: "5",
      section_title: "Importance-Based Neighborhoods and Importance Pooling",
      explanation:
        "This section details a key innovation of PinSage: importance-based neighborhoods. Instead of simply examining k-hop graph neighborhoods, PinSage defines the neighborhood of a node u as the T nodes that exert the most influence on u. This is achieved by simulating random walks starting from node u and computing the L1-normalized visit count of visited nodes. The neighborhood of u is then defined as the top T nodes with the highest normalized visit counts with respect to node u.  The advantages are twofold: controlling the memory footprint during training and allowing Algorithm 1 to account for the importance of neighbors during aggregation.  Specifically, γ in Algorithm 1 is implemented as a weighted-mean, with weights defined according to the L1 normalized visit counts. This new approach is referred to as importance pooling, giving nodes that are frequently visited more weight during the aggregation phase.",
      associated_image_filenames: [],
    },
    {
      id: "6",
      section_title: "Model Training with Max-Margin Ranking Loss",
      explanation:
        "This section elaborates on the training of the PinSage model using a max-margin ranking loss. The model is trained in a supervised fashion, leveraging a set of labeled pairs of items L, where (q,i) ∈ L implies that item i is a good recommendation candidate for query item q. The training aims to optimize PinSage's parameters to ensure that the output embeddings of related pairs (q,i) ∈ L are close together. The loss function,  $JG(zqzi) = Enk ∼Pn(q) max{0, zq · znk − zq · zi + ∆},$ maximizes the inner product of positive examples and ensures that the inner product of negative examples is smaller than that of the positive sample by a pre-defined margin ∆.  The text also discusses multi-GPU training with large minibatches and a producer-consumer architecture to optimize CPU/GPU usage during training. Furthermore, to improve training, hard negative sampling and curriculum learning are used to improve performance.",
      associated_image_filenames: [],
    },
    {
      id: "7",
      section_title: "Hard Negative Sampling",
      explanation:
        "This section explains the concept of hard negative sampling. The section notes that uniformly sampling negative examples from the entire set of items is often too 'easy' and doesn't provide fine enough resolution for the system to learn. To address this, 'hard' negative examples are added, which are items that are somewhat related to the query item q, but not as related as the positive item i. These hard negative items are generated by ranking items in a graph according to their Personalized PageRank scores with respect to the query item q. Items ranked at 2000-5000 are randomly sampled as hard negative items.  As Figure 2 in img_8_4.png illustrates, hard negative examples are more similar to the query than random negative examples, making it more challenging for the model to rank them correctly. This forces the model to learn to distinguish items at a finer granularity. Curriculum training starts without any hard negatives.",
      associated_image_filenames: ["img_8_4.png"],
    },
  ],
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  sectionId: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: "1",
    question:
      "What is the main challenge PinSage addresses in web-scale recommendation systems?",
    options: [
      "User interface design",
      "Database management",
      "Computational cost of operating on full graph Laplacian",
      "Network bandwidth limitations",
    ],
    correctAnswer: 2,
    sectionId: "1",
  },
  {
    id: "2",
    question:
      "How does PinSage differ from traditional GCNs in terms of graph processing?",
    options: [
      "It processes the entire graph at once",
      "It focuses on local neighborhoods",
      "It ignores graph structure",
      "It only processes user nodes",
    ],
    correctAnswer: 1,
    sectionId: "2",
  },
  {
    id: "3",
    question:
      "What training technique does PinSage use to improve embedding quality?",
    options: [
      "Random sampling",
      "Hard negative sampling",
      "Soft margin sampling",
      "Positive sampling",
    ],
    correctAnswer: 1,
    sectionId: "3",
  },
  {
    id: "4",
    question:
      "What is the primary advantage of using localized graph convolutions?",
    options: [
      "Slower processing time",
      "Higher memory usage",
      "Improved scalability for large graphs",
      "Better UI performance",
    ],
    correctAnswer: 2,
    sectionId: "2",
  },
  {
    id: "5",
    question:
      "Which training strategy does PinSage use to handle large-scale data?",
    options: [
      "Single-GPU processing",
      "Multi-GPU with producer-consumer architecture",
      "CPU-only processing",
      "Cloud-based distributed training",
    ],
    correctAnswer: 1,
    sectionId: "3",
  },
];
