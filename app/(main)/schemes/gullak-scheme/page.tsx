import Gullak from "@/components/Gullak/Gullak";

 

const page = () => {
  return (
    <>
      <Gullak
        onContact={() => {
          console.log("done");
        }}
        onApply={() => {
          console.log("Applying for:");
        }}
      />
    </>
  );
};

export default page;
