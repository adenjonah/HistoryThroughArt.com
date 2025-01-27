const Flashcard = ({ card, isFlipped, handleFlip, width, height }) => (
  <div
    className={`relative bg-white rounded-lg shadow-lg transition-transform duration-300 cursor-pointer ${
      isFlipped ? "transform rotate-y-180" : ""
    }`}
    style={{ width, height }} // Use width and height from props
    onClick={handleFlip}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      {!isFlipped ? (
        <img
          src={require(`../../artImages/${card.image[0]}`)}
          alt={card.name}
          className="w-full h-full object-contain rounded-lg"
        />
      ) : (
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">
            {card.id}. {card.name}
          </h3>
          <p className="text-gray-600">Location: {card.location}</p>
          <p className="text-gray-600">
            Artist/Culture: {card.artist_culture || "Unknown"}
          </p>
          <p className="text-gray-600">
            Date: {card.formattedDate || "Unknown"}
          </p>
          <p className="text-gray-600">Materials: {card.materials}</p>
        </div>
      )}
    </div>
  </div>
);

export default Flashcard;
